import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

interface ProgressChartProps {
  data: { date: string; mood: number; anxiety: number; sleep: number }[];
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ data }) => {
  return (
    <div className="w-full h-[350px] glass p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-sm">تطور المؤشرات النفسية</h3>
        <select className="bg-white/5 border border-white/10 rounded-xl px-3 py-1 text-[10px] outline-none text-[#D4B483]">
          <option>آخر أسبوع</option>
          <option>آخر شهر</option>
          <option>آخر 3 أشهر</option>
        </select>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#ffffff20" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(val) => new Date(val).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' })}
          />
          <YAxis stroke="#ffffff20" fontSize={10} domain={[0, 10]} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#181816', border: '1px solid #D4B48333', borderRadius: '16px', color: '#fff' }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }}
          />
          <Line name="المزاج" type="monotone" dataKey="mood" stroke="#D4B483" strokeWidth={2} dot={{ r: 3 }} />
          <Line name="القلق" type="monotone" dataKey="anxiety" stroke="#FF4444" strokeWidth={2} dot={{ r: 3 }} />
          <Line name="جودة النوم" type="monotone" dataKey="sleep" stroke="#44FF44" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
