import {
  Area, AreaChart, Cell, Legend, Line, LineChart, Pie, PieChart, Radar, RadarChart,
  PolarAngleAxis, PolarGrid, PolarRadiusAxis, ResponsiveContainer, Tooltip,
  XAxis, YAxis, CartesianGrid
} from 'recharts'
import BarChartReusable from './BarChartReusable'
import { CHART_COLORS } from '../lib/statistiquesConstants'

function SurveyTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const point = payload[0].payload || {}
  return (
    <div className="bg-surface border border-text-secondary/20 rounded-lg px-3 py-2 shadow-lg text-xs">
      <p className="font-semibold text-text-primary">{point.name}</p>
      <p className="font-mono text-text-secondary">
        {point.value}{point.unit || ' étudiant(e)s'}{typeof point.pct === 'number' && !point.unit ? ` · ${point.pct}%` : ''}
      </p>
    </div>
  )
}

/**
 * Chooses a visual encoding that matches survey data:
 * - donut: parts of a whole (especially yes/no answers)
 * - line / area: ordered distributions such as age, duration or expense brackets
 * - radar: a compact overview of comparable percentage indicators
 * - bar: unordered categories and multiple-choice answers
 */
export default function SurveyChart({
  data = [],
  variant = 'bar',
  theme,
  colors = CHART_COLORS,
  height = 240,
  axisStyle,
  ...barProps
}) {
  const resolvedVariant = variant === 'auto' || (variant === 'bar' && data.length === 2)
    ? (data.length === 2 ? 'donut' : 'bar')
    : variant
  const primary = theme?.primary || colors[0]
  const gridStroke = theme?.textSecondary ? `${theme.textSecondary}20` : '#64748B20'

  if (resolvedVariant === 'donut') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="80%" paddingAngle={3} cornerRadius={6}>
            {data.map((_, index) => <Cell key={index} fill={colors[index % colors.length]} />)}
          </Pie>
          <Tooltip content={<SurveyTooltip />} />
          <Legend iconType="circle" formatter={(value) => <span className="text-xs text-text-secondary">{value}</span>} />
        </PieChart>
      </ResponsiveContainer>
    )
  }

  if (resolvedVariant === 'area') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 12, right: 12, left: -18, bottom: 8 }}>
          <defs>
            <linearGradient id="survey-area-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={primary} stopOpacity={0.42} />
              <stop offset="95%" stopColor={primary} stopOpacity={0.03} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={axisStyle} interval={0} angle={-12} textAnchor="end" height={48} />
          <YAxis tick={axisStyle} allowDecimals={false} />
          <Tooltip content={<SurveyTooltip />} />
          <Area type="monotone" dataKey="value" name="Étudiants" stroke={primary} strokeWidth={2.5} fill="url(#survey-area-fill)" />
        </AreaChart>
      </ResponsiveContainer>
    )
  }

  if (resolvedVariant === 'line') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 12, right: 12, left: -18, bottom: 8 }}>
          <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={axisStyle} interval={0} angle={-12} textAnchor="end" height={48} />
          <YAxis tick={axisStyle} allowDecimals={false} />
          <Tooltip content={<SurveyTooltip />} />
          <Line type="monotone" dataKey="value" name="Étudiants" stroke={primary} strokeWidth={2.5} dot={{ r: 4, fill: primary }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  if (resolvedVariant === 'radar') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <RadarChart data={data} outerRadius="72%">
          <PolarGrid stroke={gridStroke} />
          <PolarAngleAxis dataKey="name" tick={{ ...axisStyle, fontSize: 10 }} />
          <PolarRadiusAxis tick={axisStyle} allowDecimals={false} />
          <Radar dataKey="value" name="Étudiants" stroke={primary} fill={primary} fillOpacity={0.32} />
          <Tooltip content={<SurveyTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    )
  }

  return <BarChartReusable data={data} theme={theme} colors={colors} height={height} axisStyle={axisStyle} {...barProps} />
}
