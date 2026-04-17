import { createProxyMiddleware } from "http-proxy-middleware";
import {ORDER_SERVICE_URL} from "../config/services.js"

export const orderProxy = createProxyMiddleware({
  target: ORDER_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    "^/orders": ""
  },
  on: {
        proxyReq: (proxyReq, req, res) => {  
            console.log(req.user, "req.user");
            if (req.user) {
                proxyReq.setHeader('x-user-id', String(req.user.id));
            }
        }
    }
});