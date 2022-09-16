/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import * as dayjs from "dayjs";
import * as fs from "fs";
import * as https from "https";
import { verify } from "jsonwebtoken";

import {
  ICreateCashOut,
  IListWithdraw,
  IResponseCashOut,
  IWebhookPayOut,
} from "./types";

export class PayOutPayBrokers {
  private token: string;
  private login: string;
  private password: string;
  private certPath: string;
  private keyPath: string;
  private clientBase64: string;
  private timeout: Date;
  private httpsAgent: https.Agent;

  /**
   * From build the next request is necessary your access data to PayBrokers API
   * @param login Your login in API PayBrokers
   * @param password You password in API PayBrokers
   */
  constructor(
    login: string,
    password: string,
    certPath: string,
    keyPath: string
  ) {
    this.login = login;
    this.password = password;
    this.certPath = certPath;
    this.keyPath = keyPath;

    this.clientBase64 = String(
      Buffer.from(`${login}:${password}`).toString("base64")
    );

    // --- Get certificates --- //
    this.httpsAgent = new https.Agent({
      cert: fs.readFileSync(this.certPath),
      key: fs.readFileSync(this.keyPath),
    });
  }

  /** Get access token to prosed in or requests */
  async connect(): Promise<string> {
    try {
      // --- Get access token --- //
      const response = await axios.post(
        "https://withdraw.gw-paybrokers.com/production/v3/auth/token",
        {},
        {
          httpsAgent: this.httpsAgent,
          headers: {
            Authorization: `Bearer ${this.clientBase64}`,
          },
        }
      );

      // --- Save access token and expire date --- //
      this.token = `Bearer ${response.data.token}`;
      this.timeout = dayjs().add(5, "minute").toDate();

      return response.data.token;
    } catch (err) {
      return { success: false, data: err?.response } as any;
    }
  }

  /**
   * Create withdraw request
   * @param value Withdraw value
   * @param cpf Receiver document
   * @param pix_key_type Type key of the pix
   * @param pix_key Pix key
   * @param webhook_url URL from send feedback transaction
   * */
  async createCashOut({
    value,
    cpf,
    pix_key_type,
    pix_key,
    webhook_url,
  }: ICreateCashOut): Promise<IResponseCashOut> {
    if (dayjs(this.timeout).isBefore(new Date())) {
      await this.connect();
    }
    const pixData = { value, cpf, pix_key_type, pix_key, webhook_url };
    try {
      // --- Create PIX request in PayBrokers --- //
      const response = await axios.post(
        "https://withdraw.gw-paybrokers.com/production/v3/withdraw/pix/cpf",
        pixData,
        {
          httpsAgent: this.httpsAgent,
          headers: {
            Authorization: this.token,
          },
        }
      );

      return response.data;
    } catch (err) {
      return { success: false, data: err?.response } as any;
    }
  }

  /** List your pix payments */
  async listPixWithdraws(): Promise<IListWithdraw> {
    if (dayjs(this.timeout).isBefore(new Date())) {
      await this.connect();
    }

    try {
      const response = await axios.get(
        "https://withdraw.gw-paybrokers.com/production/v3/report/withdraw/pix",
        {
          httpsAgent: this.httpsAgent,
          headers: {
            Authorization: this.token,
          },
        }
      );

      return response.data;
    } catch (err) {
      return { success: false, data: err?.response } as any;
    }
  }

  /** Get a specific pix payment
   * @param id Transaction id
   */
  async getPixWithdraw(id: string): Promise<IWebhookPayOut> {
    if (dayjs(this.timeout).isBefore(new Date())) {
      await this.connect();
    }
    try {
      const response = await axios.get(
        `https://withdraw.gw-paybrokers.com/production/v3/report/withdraw/pix/${id}`,
        {
          httpsAgent: this.httpsAgent,
          headers: {
            Authorization: this.token,
          },
        }
      );

      return response.data;
    } catch (err) {
      return { success: false, data: err?.response } as any;
    }
  }

  /** Check if message coming from PayBrokers */
  async validateWebhookMessage(bodyEncrypted: string): Promise<IWebhookPayOut> {
    try {
      const message: IWebhookPayOut = verify(
        bodyEncrypted,
        this.password
      ) as IWebhookPayOut;

      return message;
    } catch (err) {
      return { success: false, data: err } as any;
    }
  }
}
