import Block from "components/services/widget/block";
import { useTranslation } from "next-i18next";
import { useRef, useState } from "react";

import { Tooltip } from "./tooltip";

const getContent = (data, setHover, leave) => {
  const hoverTimeout = useRef(null);

  const handleMouseEnter = () => {
    if (leave) {
      clearTimeout(leave);
      leave = null;
    }

    hoverTimeout.current = setTimeout(() => {
      setHover(true);
    }, 300);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }
    leave = setTimeout(() => {
      setHover(false);
    }, 300);
  };

  return (
    <table
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="border-separate border-spacing-2 text-xs"
    >
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
};

const getClients = (clients) => {
  const unknown = clients.filter((client) => client.comment === undefined);

  if (unknown.length > 0) {
    return (
      <div className="flex items-center justify-center">
        {clients.length} <span className="ml-2 text-xxs font-bold text-red-300">{unknown.length}</span>
      </div>
    );
  }
  return clients.length;
};

const CapComponent = ({ service, cap, clients }) => {
  const { widget } = service;
  const { t } = useTranslation();
  const clients24 = clients.filter((d) => d.interface.endsWith("24"));
  const clients5 = clients.filter((d) => d.interface.endsWith("5"));
  const [hover, setHover] = useState(false);
  const [hover24, setHover24] = useState(false);
  const [hover5, setHover5] = useState(false);
  let leave,
    leave24,
    leave5 = null;

  return (
    <>
      <div className="text-xs text-right">{cap.identity}</div>
      <Tooltip
        clients={clients.length}
        content={getContent(clients, setHover, leave)}
        hover={hover}
        setHover={setHover}
        leave={leave}
      >
        <div className="cursor-pointer">
          <Block label={t("capsman.clients")} value={getClients(clients)} />
        </div>
      </Tooltip>
      <Tooltip
        clients={clients24.length}
        content={getContent(clients24, setHover24, leave24)}
        hover={hover24}
        setHover={setHover24}
        leave={leave24}
      >
        <div className="cursor-pointer">
          <Block label="capsman.24ghz" value={getClients(clients24)} />
        </div>
      </Tooltip>
      <Tooltip
        clients={clients5.length}
        content={getContent(clients5, setHover5, leave5)}
        hover={hover5}
        setHover={setHover5}
        leave={leave5}
      >
        <div className="cursor-pointer">
          <Block label="capsman.5ghz" value={getClients(clients5)} />
        </div>
      </Tooltip>
    </>
  );
};

export default CapComponent;
