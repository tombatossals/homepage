import Block from "components/services/widget/block";
import Container from "components/services/widget/container";
import { useTranslation } from "next-i18next";

import CapComponent from "./cap-component";
import RadioIcon from "./radio-icon";

import useWidgetAPI from "utils/proxy/use-widget-api";

export default function Component({ service }) {
  const { t } = useTranslation();

  const { widget } = service;

  const { data: capsData, error: capsDataError } = useWidgetAPI(widget, "caps");
  const { data: resourceData, error: resourceDataError } = useWidgetAPI(widget, "resource");
  const { data: clientsData, error: clientsDataError } = useWidgetAPI(widget, "clients");

  if (capsDataError) {
    return <Container service={service} error={capsDataError} />;
  }

  if (!capsData || !clientsData || !resourceData) {
    return (
      <Container service={service}>
        <RadioIcon />
      </Container>
    );
  }

  return (
    <Container service={service}>
      <div className="flex flex-col items-center justify-center w-full px-2 relative">
        <div className="flex items-center justify-center gap-2">
          <Block label={t("capsman.radios")} value={Object.keys(capsData).length} />
          <Block label={t("capsman.uptime")} value={resourceData.uptime} />
          <Block label={t("capsman.version")} value={resourceData.version} />
          <Block label={t("capsman.cpuLoad")} value={`${resourceData["cpu-load"]}%`} />
        </div>

        <div className="grid grid-cols-4 items-center gap-2 mt-2">
          {capsData.map((cap) => {
            const clients = [];
            Object.keys(clientsData).forEach((iface) => {
              if (iface.startsWith(cap.identity)) {
                clientsData[iface].forEach((client) => {
                  clients.push(client);
                });
              }
            });

            return <CapComponent key={cap.identity} service={service} cap={cap} clients={clients} />;
          })}
        </div>
      </div>
    </Container>
  );
}
