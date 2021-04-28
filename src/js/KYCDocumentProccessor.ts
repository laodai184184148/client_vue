import axios, { AxiosResponse } from "axios";
import { Utils } from "./Utils";

export interface KYCRecognizedData {
  readonly address: string;
  readonly birthday: string;
  readonly characteristics: string;
  readonly class: string;
  readonly country: string;
  readonly document: string;
  readonly ethnicity: string;
  readonly expiry: string;
  readonly hometown: string;
  readonly hometownconf: string;
  readonly issueBy: string;
  readonly name: string;
  readonly national: string;
}

interface KYCAttachment {
  name: string;
  content: string;
}

export interface KYCCreateRequestData {
  readonly documenType: string;
  readonly attachment: KYCAttachment;
}

export interface KYCCreateRequestResponse {
  readonly documentSubtype: string;
  readonly documentType: string;
  readonly externalPersonId: string;
  readonly id: string;
  readonly linkedFileIds: string[];
  readonly processStatus: string;
  readonly verificationStatus: string;
  readonly recognizedData: KYCRecognizedData;
}

export interface IdentifyRequestData {
  readonly photo: string;
}

export interface IdentifyRequestResponse {
  readonly confidence: number;
  readonly externalPersonId: string;
  readonly fileId: string;
  readonly id: string;
  readonly similarity: number;
}

export class KYCDocumentProcessor {
  private static documentId: string;

  static async createKYCDocument(
    imageContent: string[],
    successCallback: (data: KYCRecognizedData) => void,
    errorCallback: (error: Error) => void
  ) {
    let index = 0;
    for await (const content of imageContent) {
      try {
        const ext = content.startsWith("/") ? "jpg" : "png";
        const attachment: KYCAttachment = {
          content,
          name: `${index}.${ext}`
        };
        if (index === 0) {
          if (this.documentId) {
            continue;
          }
          const requestData: KYCCreateRequestData = {
            documenType: "identity-proof",
            attachment
          };
          const response = await this.callCreateKYCDocumentAPI(requestData);
          if (response.status >= 200 && response.status <= 300) {
            const kycDoc: KYCCreateRequestResponse = response.data as KYCCreateRequestResponse;
            if (kycDoc.id) {
              this.documentId = kycDoc.id;
            }
          }
        } else if (this.documentId) {
          await this.callUpdateKYCDocumentAPI(attachment);
        }
        index += 1;
      } catch (error) {
        errorCallback(error);
        return;
      }
    }
    const intervalId = setInterval(async () => {
      const response: AxiosResponse = await KYCDocumentProcessor.callResultKYCDocumentAPI();
      if (response.status >= 200 && response.status <= 300) {
        const verifyResponseData: any = response.data;
        Object.keys(verifyResponseData).map(value => {
          const newKey = Utils.convertToCamel(value);
          if (newKey !== value) {
            verifyResponseData[newKey] = verifyResponseData[value];
            delete verifyResponseData[value];
          }
        });
        if (verifyResponseData.recognizedData) {
          Object.keys(verifyResponseData.recognizedData).map(value => {
            const newKey = Utils.convertToCamel(value);
            if (newKey !== value) {
              verifyResponseData.recognizedData[newKey] = verifyResponseData.recognizedData[value];
              delete verifyResponseData.recognizedData[value];
            }
          });
          if (verifyResponseData.processStatus === "processed") {
            clearInterval(intervalId);
            successCallback(verifyResponseData.recognizedData);
          }
        }
      } else {
        errorCallback(new Error());
      }
    }, 3000);
  }

  private static callCreateKYCDocumentAPI(requestData: KYCCreateRequestData): Promise<AxiosResponse> {
    const verifyEndpoint: string = Utils.getConfig().API_KYC_CREATE_ENDPOINT;
    const url: string = Utils.getConfig().API_URL + verifyEndpoint;

    Object.keys(requestData).forEach(value => {
      const newKey = Utils.convertToSnakeCase(value);
      if (newKey !== value) {
        (requestData as any)[newKey] = (requestData as any)[value];
        delete (requestData as any)[value];
      }
    });
    const promise = axios.post(url, requestData, {
      auth: {
        username: Utils.getConfig().ORG_ID,
        password: Utils.getConfig().ORG_API_KEY
      }
    });
    return promise;
  }

  private static callUpdateKYCDocumentAPI(requestData: KYCAttachment): Promise<any> {
    const verifyEndpoint: string = Utils.getConfig().API_KYC_RESULT_ENDPOINT_PATTERN.replace(
      "{documentsId}",
      this.documentId
    );
    const url: string = Utils.getConfig().API_URL + verifyEndpoint;
    const promise = axios.post(url, requestData, {
      auth: {
        username: Utils.getConfig().ORG_ID,
        password: Utils.getConfig().ORG_API_KEY
      }
    });
    return promise;
  }

  private static callResultKYCDocumentAPI(): Promise<AxiosResponse> {
    const verifyEndpoint: string = Utils.getConfig().API_KYC_RESULT_ENDPOINT_PATTERN.replace(
      "{documentsId}",
      this.documentId
    );
    const url: string = Utils.getConfig().API_URL + verifyEndpoint;
    const promise = axios.get(url, {
      auth: {
        username: Utils.getConfig().ORG_ID,
        password: Utils.getConfig().ORG_API_KEY
      }
    });
    return promise;
  }

  // static async verifyFace(
  //   imageContent: string[],
  //   successCallback: (response: IdentifyRequestResponse) => void,
  //   errorCallback: (error: Error) => void
  // ): void {
  //   let index = 0;
  //   for await (const image of imageContent) {
  //     if ((index = 0)) {
  //     }
  //   }
  // }

  // private static callRegisterFaceAPI(): Promise<AxiosResponse> {
  //   const verifyEndpoint: string = Utils.getConfig().API_KYC_REGISTER_FACE_ENDPOINT_PATTERN.replace(
  //     "{collectionId}",
  //     Utils.getConfig().COLLECTIONS_ID
  //   );
  //   const url: string = Utils.getConfig().API_URL + verifyEndpoint;
  //   const promise = axios.post(url, {
  //     auth: {
  //       username: Utils.getConfig().ORG_ID,
  //       password: Utils.getConfig().ORG_API_KEY
  //     }
  //   });
  //   return promise;
  // }

  // private static callIdentifyAPI(): Promise<AxiosResponse> {
  //   const verifyEndpoint: string = Utils.getConfig().API_KYC_IDENTIFY_ENDPOINT_PATTERN.replace(
  //     "{collectionId}",
  //     Utils.getConfig().COLLECTIONS_ID
  //   );
  //   const url: string = Utils.getConfig().API_URL + verifyEndpoint;
  //   const promise = axios.post(url, {
  //     auth: {
  //       username: Utils.getConfig().ORG_ID,
  //       password: Utils.getConfig().ORG_API_KEY
  //     }
  //   });
  //   return promise;
  // }
}
