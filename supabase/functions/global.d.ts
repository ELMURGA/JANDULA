declare namespace Deno {
  const env: {
    get(key: string): string | undefined;
  };
}

declare module 'https://*' {
  const defaultExport: any;
  export default defaultExport;
  export const serve: any;
  export const createClient: any;
}

declare namespace Stripe {
  type StripeConfig = Record<string, any>;

  namespace Checkout {
    interface SessionCreateParams {
      [key: string]: any;
    }

    namespace SessionCreateParams {
      interface LineItem {
        [key: string]: any;
      }
    }

    interface Session {
      [key: string]: any;
    }
  }

  interface Event {
    type: string;
    data: {
      object: any;
    };
    [key: string]: any;
  }
}
