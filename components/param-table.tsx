type Param = {
  name: string;
  type: string;
  required?: boolean;
  description: string;
};

export function ParamTable({ params }: { params: Param[] }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Required</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {params.map((p) => (
          <tr key={p.name}>
            <td>
              <code>{p.name}</code>
            </td>
            <td>
              <code>{p.type}</code>
            </td>
            <td>{p.required ? "yes" : "no"}</td>
            <td>{p.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
