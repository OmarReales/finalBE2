import { initJwtStrategy } from "./strategies.js";

export const initializePassport = () => {
  initJwtStrategy();
};
