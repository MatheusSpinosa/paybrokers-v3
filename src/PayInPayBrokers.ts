/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import * as dayjs from "dayjs";
import * as fs from "fs";
import * as https from "https";
import { verify } from "jsonwebtoken";

import {
  ICreatePixCashIn,
  IGetPayment,
  IListPayment,
  IResponsePixCashIn,
  IWebhookMessage,
} from "./types";

export class PayInPayBrokers {
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
        "https://payment.gw-paybrokers.com/production/v3/auth/token",
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
   * Create deposit pix
   * @param webhook_url URL from response of operation
   * @param value Value of deposit
   * @param buyer Sender information
   * */
  async createPixCashIn({
    webhook_url,
    value,
    buyer,
  }: ICreatePixCashIn): Promise<IResponsePixCashIn> {
    const pixData = { webhook_url, value, buyer };

    try {
      // --- Create PIX request in PayBrokers --- //
      const response = await axios.post(
        "https://payment.gw-paybrokers.com/production/v3/payment/pix",
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
  async listPixPayments(): Promise<IListPayment> {
    try {
      const response = await axios.get(
        "https://payment.gw-paybrokers.com/production/v3/report/transactions/pix",
        {
          httpsAgent: this.httpsAgent,
          headers: {
            Authorization: this.token,
          },
        }
      );

      return response.data as IListPayment;
    } catch (err) {
      return { success: false, data: err?.response } as any as any;
    }
  }

  /** Get a specific pix payment
   * @param id Transaction id
   */
  async getPixPayments(id: string): Promise<IGetPayment> {
    try {
      const response = await axios.get(
        `https://payment.gw-paybrokers.com/production/v3/report/transactions/pix/${id}`,
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
  async validateWebhookMessage(
    bodyEncrypted: string
  ): Promise<IWebhookMessage> {
    try {
      const message: IWebhookMessage = verify(
        bodyEncrypted,
        this.password
      ) as IWebhookMessage;

      return message;
    } catch (err) {
      return { success: false, data: err } as any;
    }
  }
}
