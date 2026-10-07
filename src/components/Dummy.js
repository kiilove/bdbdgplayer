export const DummyTable = () => (
  <div className="w-full overflow-x-auto">
    <table className="w-full text-xs text-neutral-300 border-collapse">
      <thead>
        <tr className="bg-neutral-900 border-y border-neutral-800 font-bold text-neutral-400">
          <th className="py-2.5 px-3 text-center border-r border-neutral-800">심판</th>
          <th className="py-2.5 px-2 text-center border-r border-neutral-800">A</th>
          <th className="py-2.5 px-2 text-center border-r border-neutral-800">B</th>
          <th className="py-2.5 px-2 text-center border-r border-neutral-800">C</th>
          <th className="py-2.5 px-2 text-center border-r border-neutral-800">D</th>
          <th className="py-2.5 px-2 text-center border-r border-neutral-800">E</th>
          <th className="py-2.5 px-2 text-center border-r border-neutral-800">F</th>
          <th className="py-2.5 px-2 text-center border-r border-neutral-800">G</th>
          <th className="py-2.5 px-2 text-center border-r border-neutral-800">H</th>
          <th className="py-2.5 px-2 text-center border-r border-neutral-800">I</th>
          <th className="py-2.5 px-3 text-center text-white font-black">합계</th>
        </tr>
      </thead>
      <tbody>
        {["신체", "예술", "독창", "규정", "의상"].map((cat) => (
          <tr key={cat} className="border-b border-neutral-800/80 hover:bg-neutral-900/50 transition">
            <td className="py-2 px-3 text-center font-bold text-white border-r border-neutral-800">{cat}</td>
            <td className="py-2 px-2 text-center border-r border-neutral-800 font-medium">5</td>
            <td className="py-2 px-2 text-center border-r border-neutral-800 font-medium">4</td>
            <td className="py-2 px-2 text-center border-r border-neutral-800 font-medium">5</td>
            <td className="py-2 px-2 text-center border-r border-neutral-800 font-medium">6</td>
            <td className="py-2 px-2 text-center border-r border-neutral-800 font-medium">3</td>
            <td className="py-2 px-2 text-center border-r border-neutral-800 font-medium">4</td>
            <td className="py-2 px-2 text-center border-r border-neutral-800 font-medium">5</td>
            <td className="py-2 px-2 text-center border-r border-neutral-800 font-medium">3</td>
            <td className="py-2 px-2 text-center border-r border-neutral-800 font-medium">2</td>
            <td className="py-2 px-3 text-center font-black text-white">12</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const DummyTable2 = () => (
  <div className="w-full">
    <table className="w-full text-xs text-neutral-300">
      <thead>
        <tr className="border-b border-neutral-800 font-bold text-neutral-500 pb-2">
          <th className="py-2 text-left">분석항목</th>
          <th className="py-2 text-center">편차</th>
          <th className="py-2 text-center">내 기록</th>
          <th className="py-2 text-right">TOP10 평균</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-neutral-800/60">
        {[
          { label: "신체", diff: "+2", my: "12", top: "10" },
          { label: "예술", diff: "-4", my: "10", top: "14" },
          { label: "독창", diff: "0", my: "11", top: "11" },
          { label: "규정", diff: "+1", my: "11", top: "10" },
          { label: "의상", diff: "+2", my: "14", top: "12" },
        ].map((row) => (
          <tr key={row.label} className="hover:bg-neutral-900/40 transition">
            <td className="py-3 font-bold text-white">{row.label}</td>
            <td className="py-3 text-center">
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-black tracking-tight ${
                row.diff.startsWith("+") 
                  ? "bg-white text-black" 
                  : row.diff.startsWith("-")
                  ? "bg-neutral-800 text-neutral-300 border border-neutral-700"
                  : "bg-neutral-900 text-neutral-500"
              }`}>
                {row.diff}
              </span>
            </td>
            <td className="py-3 text-center font-black text-white">{row.my}</td>
            <td className="py-3 text-right font-medium text-neutral-400">{row.top}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
