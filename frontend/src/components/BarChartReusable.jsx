import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend
} from 'recharts'
import { CHART_COLORS } from '../lib/statistiquesConstants'

// ── Custom recharts tooltip ────────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const point = payload[0]?.payload || {}
  return (
    <div className="bg-surface border border-text-secondary/20 rounded-lg px-3 py-2 shadow-lg text-xs">
      {label !== undefined && <p className="font-semibold text-text-primary mb-1">{label}</p>}
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color }} className="font-mono">
          {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
          {entry.unit || ''}
        </p>
      ))}
      {typeof point.pct === 'number' && typeof point.total === 'number' && (
        <p className="font-mono text-text-secondary">
          soit {point.pct}% (n={point.value ?? '?'}/{point.total})
        </p>
      )}
      {typeof point.pct !== 'number' && typeof point.n === 'number' && (
        <p className="font-mono text-text-secondary">échantillon : n={point.n}</p>
      )}
    </div>
  )
}

export default function BarChartReusable({
  data,
  dataKey = 'value',
  name = 'Étudiants',
  layout = 'vertical',
  width = '100%',
  height = 240,
  margin = { left: 10 },
  axisStyle = { fontSize: 11, fill: '#64748B' },
  theme,
  colors = CHART_COLORS,
  allowDecimals = false,
  barSize = 30,
  radius = [0, 6, 6, 0],
  customTooltip = true,
  showCartesianGrid = true,
  xAxisDataKey = 'name',
  yAxisType = 'category',
  yAxisWidth = 100,
  showLegend = false,
  legendProps = {}
}) {
  const gridStroke = theme?.textSecondary ? theme.textSecondary + '20' : '#64748B20'
  const barColor = theme?.primary || CHART_COLORS[0]

  return (
    <ResponsiveContainer width={width} height={height}>
      <BarChart data={data} layout={layout} margin={margin}>
        {showCartesianGrid && (
          <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
        )}
        
        {layout === 'vertical' ? (
          <>
            <XAxis 
              type="number" 
              tick={axisStyle} 
              allowDecimals={allowDecimals} 
            />
            <YAxis 
              type={yAxisType} 
              dataKey={xAxisDataKey} 
              width={yAxisWidth} 
              tick={axisStyle} 
            />
          </>
        ) : (
          <>
            <XAxis 
              dataKey={xAxisDataKey} 
              tick={axisStyle} 
              interval={0} 
              angle={-10} 
              textAnchor="end" 
              height={40} 
            />
            <YAxis 
              tick={axisStyle} 
              allowDecimals={allowDecimals}
              domain={[0, 'auto']}
            />
          </>
        )}
        
        <Tooltip content={customTooltip ? <CustomTooltip /> : <Tooltip />} />
        
        {showLegend && <Legend {...legendProps} />}
        
        <Bar 
          dataKey={dataKey} 
          name={name} 
          radius={radius} 
          barSize={barSize} 
          fill={barColor}
          minPointSize={2}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={colors[i % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
