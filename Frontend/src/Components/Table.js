import React from 'react';

const Table = ({data}) => {
  return (
    <div className="container mx-auto my-8 text-white">
      <table className="w-[100%] ml-[2rem]">
        <thead>
          <tr className='text-white'>
            <th className="border p-2 px-4 text-[#00EFFE]">Rank</th>
            <th className="border p-2 px-6 text-[#00EFFE]">DocId</th>
            <th className="border p-2 px-6 text-[#00EFFE]">Relavance</th>
            <th className="border p-2 px-6 text-[#00EFFE]">Precision</th>
            <th className="border p-2 px-6 text-[#00EFFE]">Recall</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td className="border p-2 px-4 text-center">{row.rank}</td>
              <td className="border p-2 px-6 text-center">{row.docId}</td>
              <td className="border p-2 px-6 text-center">{row.relevance}</td>
              <td className="border p-2 px-6 text-center">{row.precision}</td>
              <td className="border p-2 px-6 text-center">{row.recall}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
