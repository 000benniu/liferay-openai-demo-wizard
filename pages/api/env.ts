import { NextApiRequest, NextApiResponse } from "next";

import schema, { z } from "../../schemas/zod";
import { axiosInstance } from "../../services/liferay";
import { logger } from "../../utils/logger";

const debug = logger("Environment - Action");

const STATE_OK = "OK";
const STATE_NOT_ADMIN = "NOT ADMIN";
const STATE_CANNOT_CONNECT = "CANNOT CONNECT";

type ConfigBody = z.infer<typeof schema.config>;

export default async function Action(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // リクエストメソッドの確認
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { authenticationType, base64data, login, openAIKey, serverURL } =
    req.body as ConfigBody;

  let message = "";
  let status = "error";

  try {
    if (authenticationType === "basic" && !base64data?.trim()) {
      message =
        "<b>Login and password is required.</b> Please complete the configuration. (click here)";
    } else if (openAIKey.length == 0) {
      message =
        "<b>OpenAI API key is required.</b> Please add an api key to the configuration. (click here)";
    } else if (serverURL.length == 0) {
      message =
        "<b>A Liferay instance serverURL is required.</b> Please add it to the configuration. (click here)";
    } else {
      let test = await isConnected(req, res);
      if (test == STATE_CANNOT_CONNECT) {
        message =
          "Cannot connect to <b>" +
          serverURL +
          "</b> with user <b>" +
          login +
          "</b> Please complete configuration. (click here)";
      } else if (test == STATE_NOT_ADMIN) {
        message =
          "User <b>" + login + "</b> is not an admin. An admin user is required.";
      } else if (test == STATE_OK) {
        message =
          "Connected to <b>" + serverURL + "</b> with user <b>" + login + "</b>";
        status = "connected";
      }
    }

    // レスポンスを一度だけ送信
    return res.status(200).json({ result: message, status: status });
  } catch (error) {
    debug({ error });
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function isConnected(request: NextApiRequest, response: NextApiResponse) {
  const axios = axiosInstance(request, response);

  try {
    console.log('=== isConnected Request Details ===');
    console.log('Request URL:', request.url);
    console.log('Request Method:', request.method);
    console.log('Request Headers:', request.headers);
    console.log('Request Body:', request.body);

    const response = await axios.get(
      "/o/headless-admin-user/v1.0/my-user-account",
    );

    console.log('=== isConnected Response Details ===');
    console.log('Response Status:', response.status);
    console.log('Response Status Text:', response.statusText);
    console.log('Response Headers:', response.headers);
    console.log('Response Data:', response.data);

    let userRoles = response.data.roleBriefs;

    for (let i = 0; i < userRoles.length; i++) {
      if (userRoles[i].name == "Administrator") {
        console.log('=== User Role Check ===');
        console.log('Found Administrator role');
        return STATE_OK;
      }
    }

    console.log('=== User Role Check ===');
    console.log('No Administrator role found');
    return STATE_NOT_ADMIN;
  } catch (error) {
    console.log('=== isConnected Error Details ===');
    console.log('Error:', error);
    console.log('Error Message:', error.message);
    console.log('Error Response:', error.response?.data);
    console.log('Error Status:', error.response?.status);
    debug({ error });
    return STATE_CANNOT_CONNECT;
  }
}
