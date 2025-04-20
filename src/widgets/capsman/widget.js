import genericProxyHandler from "utils/proxy/handlers/generic";
import { asJson } from "utils/proxy/api-helpers";

const widget = {
  api: "{url}/rest/{endpoint}",
  proxyHandler: genericProxyHandler,

  mappings: {
    caps: {
      endpoint: "caps-man/remote-cap",
    },
    clients: {
      endpoint: "caps-man/registration-table",
      map: (data) => {
        const json_data = asJson(data)

        const interfaces = json_data.reduce((acc, item) => {
          const key = item.interface;
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(item);
          return acc;
        }, {});
        return interfaces;
      },
    },
    traffic: {
      endpoint: "interface/monitor-traffic",
      params: ["interface", "duration"],
    }
  },
};

export default widget;
