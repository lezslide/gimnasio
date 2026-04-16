import { hasSupabaseEnv, supabase } from './supabase';

const monthFormatter = new Intl.DateTimeFormat('es-AR', { month: 'short' });

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function monthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function buildMonthBuckets() {
  const months = [];
  const now = new Date();

  for (let index = 5; index >= 0; index -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
    months.push({
      key: monthKey(date),
      label: monthFormatter.format(date).replace('.', ''),
      income: 0,
      retention: 0,
      members: new Set(),
    });
  }

  return months;
}

function getDateValue(record, keys) {
  for (const key of keys) {
    if (record?.[key]) {
      const value = new Date(record[key]);
      if (!Number.isNaN(value.getTime())) return value;
    }
  }

  return null;
}

function getMemberValue(record) {
  return record?.member_id ?? record?.user_id ?? record?.profile_id ?? record?.customer_id ?? null;
}

function getAmountValue(record) {
  const rawValue = Number(record?.amount ?? record?.total_amount ?? record?.price ?? 0);
  return Number.isFinite(rawValue) ? rawValue : 0;
}

function clampRetention(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function computeRetention(months) {
  return months.map((month, index) => {
    if (index === 0) {
      return { ...month, retention: month.members.size > 0 ? 100 : 0 };
    }

    const previous = months[index - 1].members;
    const current = month.members;

    if (previous.size === 0) {
      return { ...month, retention: current.size > 0 ? 100 : 0 };
    }

    let retained = 0;
    previous.forEach((memberId) => {
      if (current.has(memberId)) retained += 1;
    });

    return {
      ...month,
      retention: clampRetention((retained / previous.size) * 100),
    };
  });
}

function buildFallbackMetrics(fallbackMonthlyStats, payments, riskMembers) {
  const paidPayments = payments.filter((item) => item.status === 'paid');
  const paidToday = paidPayments.reduce((sum, item) => sum + item.amount, 0);
  const pendingToday = payments.filter((item) => item.status === 'pending').reduce((sum, item) => sum + item.amount, 0);
  const monthlyRevenue = fallbackMonthlyStats.reduce((sum, item) => sum + item.income, 0) * 100;

  return {
    source: 'demo',
    statusLabel: 'Modo demo',
    chart: fallbackMonthlyStats,
    cash: {
      paidToday,
      pendingToday,
      monthlyRevenue,
    },
    retention: {
      atRiskCount: riskMembers.length,
      rate: Math.max(82, 94 - riskMembers.length * 2),
    },
  };
}

export async function loadOwnerMetrics({ fallbackMonthlyStats, payments, riskMembers }) {
  if (!hasSupabaseEnv || !supabase) {
    return buildFallbackMetrics(fallbackMonthlyStats, payments, riskMembers);
  }

  try {
    const [paymentsResult, checkinsResult, bookingsResult] = await Promise.all([
      supabase.from('payments').select('amount,status,paid_at,created_at,member_id,user_id'),
      supabase.from('checkins').select('member_id,user_id,check_in_at,created_at'),
      supabase.from('bookings').select('member_id,user_id,status,created_at'),
    ]);

    if (paymentsResult.error) throw paymentsResult.error;
    if (checkinsResult.error) throw checkinsResult.error;
    if (bookingsResult.error) throw bookingsResult.error;

    const months = buildMonthBuckets();
    const monthIndex = Object.fromEntries(months.map((item, index) => [item.key, index]));
    const activeMonthKey = monthKey(startOfMonth(new Date()));

    (paymentsResult.data ?? []).forEach((record) => {
      const dateValue = getDateValue(record, ['paid_at', 'created_at']);
      if (!dateValue) return;

      const key = monthKey(startOfMonth(dateValue));
      const index = monthIndex[key];
      if (index === undefined) return;

      const status = String(record.status ?? '').toLowerCase();
      if (status && !['paid', 'completed', 'approved', 'success'].includes(status)) return;

      months[index].income += getAmountValue(record);

      const memberId = getMemberValue(record);
      if (memberId) months[index].members.add(String(memberId));
    });

    (checkinsResult.data ?? []).forEach((record) => {
      const dateValue = getDateValue(record, ['check_in_at', 'created_at']);
      if (!dateValue) return;

      const key = monthKey(startOfMonth(dateValue));
      const index = monthIndex[key];
      if (index === undefined) return;

      const memberId = getMemberValue(record);
      if (memberId) months[index].members.add(String(memberId));
    });

    (bookingsResult.data ?? []).forEach((record) => {
      const dateValue = getDateValue(record, ['created_at']);
      if (!dateValue) return;

      const key = monthKey(startOfMonth(dateValue));
      const index = monthIndex[key];
      if (index === undefined) return;

      const status = String(record.status ?? '').toLowerCase();
      if (status && ['cancelled', 'canceled', 'no_show'].includes(status)) return;

      const memberId = getMemberValue(record);
      if (memberId) months[index].members.add(String(memberId));
    });

    const chart = computeRetention(months).map(({ label, income, retention }) => ({
      month: label.charAt(0).toUpperCase() + label.slice(1),
      income: Math.round(income),
      retention,
    }));

    const currentMonth = months[monthIndex[activeMonthKey]] ?? months[months.length - 1];
    const paidToday = (paymentsResult.data ?? [])
      .filter((record) => {
        const dateValue = getDateValue(record, ['paid_at', 'created_at']);
        if (!dateValue) return false;
        const today = new Date();
        return (
          dateValue.getFullYear() === today.getFullYear() &&
          dateValue.getMonth() === today.getMonth() &&
          dateValue.getDate() === today.getDate()
        );
      })
      .reduce((sum, record) => sum + getAmountValue(record), 0);

    const pendingToday = payments
      .filter((item) => item.status === 'pending')
      .reduce((sum, item) => sum + item.amount, 0);

    return {
      source: 'supabase',
      statusLabel: 'Conectado a Supabase',
      chart,
      cash: {
        paidToday,
        pendingToday,
        monthlyRevenue: chart.reduce((sum, item) => sum + item.income, 0),
      },
      retention: {
        atRiskCount: riskMembers.length,
        rate: chart[chart.length - 1]?.retention ?? 0,
        activeMembers: currentMonth.members.size,
      },
    };
  } catch (error) {
    return {
      ...buildFallbackMetrics(fallbackMonthlyStats, payments, riskMembers),
      source: 'fallback',
      statusLabel: 'Supabase no disponible, usando demo',
      errorMessage: error.message,
    };
  }
}
