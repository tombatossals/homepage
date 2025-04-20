import Block from "components/services/widget/block";
import { useTranslation } from "next-i18next";

import { Tooltip } from "./tooltip";


const getContent = (data) =>{
  return (
    <table className="border-separate border-spacing-2 text-xs">
      <thead>
        <tr>
          <th className="text-center">Name</th>
          <th className="text-center">Mac Address</th>
          <th className="text-center">Signal Strength</th>
          <th className="text-center">Interface</th>
          <th className="text-center">Uptime</th>
        </tr>
        </thead>
      <tbody>
        {data.map((client, i) => (
          <tr key={i}>
            <td className="text-center">{client.comment ?? "Unknown"}</td>
            <td className="text-center">{client["mac-address"]}</td>
            <td className="text-center">{client["rx-signal"]}</td>
            <td className="text-center">{client.interface}</td>
            <td className="text-center">{client.uptime}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const CapComponent = ({ service, cap, clients }) => {
  const { widget } = service;
  const { t } = useTranslation();
  const clients24 = clients.filter(d => d.interface.endsWith("24"));
  const clients5 = clients.filter(d => d.interface.endsWith("5"));

  return (
      <>
        <div className="text-xs text-right">{cap.identity}</div>
        <Tooltip content={getContent(clients)}>
          <div className="cursor-pointer">
            <Block
              label={t("capsman.clients")}
              value={clients.length}
            />
          </div>
        </Tooltip>
        <Tooltip content={getContent(clients24)} className="cursor-pointer">
          <div className="cursor-pointer">
            <Block
              label="capsman.24ghz"
              value={clients24.length}
            />
          </div>
        </Tooltip>
        <Tooltip content={getContent(clients5)} className="cursor-pointer">
          <div className="cursor-pointer">
            <Block
              label="capsman.5ghz"
              value={clients5.length}
            />
          </div>
        </Tooltip>
      </>
  )
};

export default CapComponent;
