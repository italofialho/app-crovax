import { API_URL, HEADER_VALUE } from "./common/Constants";
import axios from "axios";

export function getStandings(championshipId) {
  return new Promise((resolve, reject) => {
    const URL = `${API_URL}/competitions/${championshipId}/standings`;
    const REQUEST_CONFIG = { headers: { "X-Auth-Token": HEADER_VALUE } };
    const LAST_ROUND = 0;

    axios
      .get(URL, REQUEST_CONFIG)
      .then(function(response) {
        if (
          response.data &&
          response.data.standings[LAST_ROUND] &&
          response.data.standings[LAST_ROUND].table
        ) {
          let table = response.data.standings[LAST_ROUND].table;
          resolve({ table, success: true });
        } else {
          reject({
            message: "Erro ao consultar última rodada na API",
            success: false
          });
        }
      })
      .catch(function(error) {
        reject(error);
      });
  });
}
