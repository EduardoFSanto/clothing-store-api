import fs from "node:fs/promises";

const API_URL =
  process.env.API_URL ?? "http://localhost:3333";

const OUTPUT_FILE =
  process.env.TEST_OUTPUT ?? "./api-test-result.txt";

const TEST_CEP = "27255000";

const timestamp = new Date().toISOString();

const results = [];

function log(message = "") {
  console.log(message);
  results.push(message);
}

function pass(name, details = "") {
  log(`PASS | ${name}${details ? ` | ${details}` : ""}`);
}

function fail(name, details = "") {
  log(`FAIL | ${name}${details ? ` | ${details}` : ""}`);
}

function skip(name, details = "") {
  log(`SKIP | ${name}${details ? ` | ${details}` : ""}`);
}

async function request(method, path, body) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body !== undefined) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(
    `${API_URL}${path}`,
    options,
  );

  const text = await response.text();

  let data;

  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  return {
    status: response.status,
    ok: response.ok,
    data,
  };
}

function getData(response) {
  if (!response) {
    return null;
  }

  if (
    response.data &&
    typeof response.data === "object" &&
    "data" in response.data
  ) {
    return response.data.data;
  }

  return response.data;
}

function getErrorMessage(response) {
  if (!response) {
    return "Unknown error";
  }

  if (
    response.data &&
    typeof response.data === "object"
  ) {
    if (
      typeof response.data.message === "string"
    ) {
      return response.data.message;
    }

    if (
      response.data.error &&
      typeof response.data.error === "object" &&
      typeof response.data.error.message === "string"
    ) {
      return response.data.error.message;
    }
  }

  if (typeof response.data === "string") {
    return response.data;
  }

  return JSON.stringify(response.data);
}

async function saveResults() {
  await fs.writeFile(
    OUTPUT_FILE,
    results.join("\n"),
    "utf8",
  );

  console.log("");
  console.log(
    `Resultado salvo em: ${OUTPUT_FILE}`,
  );
}

async function run() {
  log("========================================");
  log("SAINT MARIN - API AUTOMATED TEST");
  log("========================================");
  log(`Data: ${timestamp}`);
  log(`API: ${API_URL}`);
  log(`Test CEP: ${TEST_CEP}`);
  log("");

  let category = null;
  let product = null;
  let variant = null;
  let customer = null;

  let order = null;
  let payment = null;

  /*
   * ==================================================
   * 1. HEALTH
   * ==================================================
   */

  try {
    const response = await request(
      "GET",
      "/health",
    );

    if (
      response.ok &&
      response.data?.status === "ok"
    ) {
      pass(
        "Health check",
        `HTTP ${response.status}`,
      );
    } else {
      fail(
        "Health check",
        `HTTP ${response.status}`,
      );

      await saveResults();
      return;
    }
  } catch (error) {
    fail(
      "Health check",
      error instanceof Error
        ? error.message
        : String(error),
    );

    await saveResults();
    return;
  }

  /*
   * ==================================================
   * 2. CREATE CATEGORY
   * ==================================================
   */

  try {
    const suffix = Date.now();

    const response = await request(
      "POST",
      "/categories",
      {
        name: `Categoria Teste ${suffix}`,
        slug: `categoria-teste-${suffix}`,
      },
    );

    if (
      response.status === 201 ||
      response.status === 200
    ) {
      category = getData(response);

      if (category?.id) {
        pass(
          "Create category",
          `HTTP ${response.status}`,
        );
      } else {
        fail(
          "Create category",
          "Response did not contain category id",
        );
      }
    } else {
      fail(
        "Create category",
        `HTTP ${response.status} - ${getErrorMessage(response)}`,
      );
    }
  } catch (error) {
    fail(
      "Create category",
      error instanceof Error
        ? error.message
        : String(error),
    );
  }

  if (!category?.id) {
    skip(
      "Product tests",
      "Category was not created",
    );

    await saveResults();
    return;
  }

  /*
   * ==================================================
   * 3. GET CATEGORIES
   * ==================================================
   */

  try {
    const response = await request(
      "GET",
      "/categories",
    );

    const categories = getData(response);

    if (
      response.ok &&
      Array.isArray(categories)
    ) {
      pass(
        "Get categories",
        `HTTP ${response.status}`,
      );
    } else {
      fail(
        "Get categories",
        `HTTP ${response.status} - ${getErrorMessage(response)}`,
      );
    }
  } catch (error) {
    fail(
      "Get categories",
      error instanceof Error
        ? error.message
        : String(error),
    );
  }

  /*
   * ==================================================
   * 4. CREATE PRODUCT
   * ==================================================
   */

  try {
    const suffix = Date.now();

    const response = await request(
      "POST",
      "/products",
      {
        categoryId: category.id,
        name: `Produto Teste ${suffix}`,
        slug: `produto-teste-${suffix}`,
        description:
          "Produto criado automaticamente pelo teste da API",
      },
    );

    if (
      response.status === 201 ||
      response.status === 200
    ) {
      product = getData(response);

      if (product?.id) {
        pass(
          "Create product",
          `HTTP ${response.status}`,
        );
      } else {
        fail(
          "Create product",
          "Response did not contain product id",
        );
      }
    } else {
      fail(
        "Create product",
        `HTTP ${response.status} - ${getErrorMessage(response)}`,
      );
    }
  } catch (error) {
    fail(
      "Create product",
      error instanceof Error
        ? error.message
        : String(error),
    );
  }

  if (!product?.id) {
    skip(
      "Variant tests",
      "Product was not created",
    );

    await saveResults();
    return;
  }

  /*
   * ==================================================
   * 5. GET PRODUCTS
   * ==================================================
   */

  try {
    const response = await request(
      "GET",
      "/products",
    );

    const products = getData(response);

    if (
      response.ok &&
      Array.isArray(products)
    ) {
      pass(
        "Get products",
        `HTTP ${response.status}`,
      );
    } else {
      fail(
        "Get products",
        `HTTP ${response.status} - ${getErrorMessage(response)}`,
      );
    }
  } catch (error) {
    fail(
      "Get products",
      error instanceof Error
        ? error.message
        : String(error),
    );
  }

  /*
   * ==================================================
   * 6. GET PRODUCT BY ID
   * ==================================================
   */

  try {
    const response = await request(
      "GET",
      `/products/${product.id}`,
    );

    const productData = getData(response);

    if (
      response.ok &&
      productData?.id === product.id
    ) {
      pass(
        "Get product by id",
        `HTTP ${response.status}`,
      );
    } else {
      fail(
        "Get product by id",
        `HTTP ${response.status} - ${getErrorMessage(response)}`,
      );
    }
  } catch (error) {
    fail(
      "Get product by id",
      error instanceof Error
        ? error.message
        : String(error),
    );
  }

  /*
   * ==================================================
   * 7. CREATE PRODUCT VARIANT
   * ==================================================
   */

  try {
    const suffix = Date.now();

    const response = await request(
      "POST",
      `/products/${product.id}/variants`,
      {
        productId: product.id,
        sku: `TEST-${suffix}`,
        size: "M",
        color: "Preta",
        priceInCents: 5990,
        stock: 10,
        weightInGrams: 500,
        lengthInCentimeters: 30,
        heightInCentimeters: 5,
        widthInCentimeters: 25,
      },
    );

    if (
      response.status === 201 ||
      response.status === 200
    ) {
      variant = getData(response);

      if (variant?.id) {
        pass(
          "Create product variant",
          `HTTP ${response.status}`,
        );
      } else {
        fail(
          "Create product variant",
          "Response did not contain variant id",
        );
      }
    } else {
      fail(
        "Create product variant",
        `HTTP ${response.status} - ${getErrorMessage(response)}`,
      );
    }
  } catch (error) {
    fail(
      "Create product variant",
      error instanceof Error
        ? error.message
        : String(error),
    );
  }

  if (!variant?.id) {
    skip(
      "Order tests",
      "Variant was not created",
    );

    await saveResults();
    return;
  }

  /*
   * ==================================================
   * 8. GET PRODUCT VARIANTS
   * ==================================================
   */

  try {
    const response = await request(
      "GET",
      `/products/${product.id}/variants`,
    );

    const variants = getData(response);

    const foundVariant =
      Array.isArray(variants)
        ? variants.find(
            (item) => item.id === variant.id,
          )
        : null;

    if (
      response.ok &&
      foundVariant?.id === variant.id
    ) {
      pass(
        "Get product variants",
        `HTTP ${response.status}`,
      );
    } else {
      fail(
        "Get product variants",
        `HTTP ${response.status} - ${getErrorMessage(response)}`,
      );
    }
  } catch (error) {
    fail(
      "Get product variants",
      error instanceof Error
        ? error.message
        : String(error),
    );
  }

  /*
   * ==================================================
   * 9. GET VARIANT BY ID
   * ==================================================
   */

  try {
    const response = await request(
      "GET",
      `/products/variants/${variant.id}`,
    );

    const variantData = getData(response);

    if (
      response.ok &&
      variantData?.id === variant.id
    ) {
      pass(
        "Get variant by id",
        `HTTP ${response.status}`,
      );
    } else {
      fail(
        "Get variant by id",
        `HTTP ${response.status} - ${getErrorMessage(response)}`,
      );
    }
  } catch (error) {
    fail(
      "Get variant by id",
      error instanceof Error
        ? error.message
        : String(error),
    );
  }

  /*
   * ==================================================
   * 10. CUSTOMER
   * ==================================================
   */

  try {
    const suffix = Date.now();

    const response = await request(
      "POST",
      "/customers/find-or-create",
      {
        name: "Cliente Teste",
        email: `teste-${suffix}@example.com`,
        phone: "24999999999",
      },
    );

    if (
      response.status === 200 ||
      response.status === 201
    ) {
      customer = getData(response);

      if (customer?.id) {
        pass(
          "Find or create customer",
          `HTTP ${response.status}`,
        );
      } else {
        fail(
          "Find or create customer",
          "Response did not contain customer id",
        );
      }
    } else {
      fail(
        "Find or create customer",
        `HTTP ${response.status} - ${getErrorMessage(response)}`,
      );
    }
  } catch (error) {
    fail(
      "Find or create customer",
      error instanceof Error
        ? error.message
        : String(error),
    );
  }

  if (!customer?.id) {
    skip(
      "Order tests",
      "Customer was not created",
    );

    await saveResults();
    return;
  }

  /*
   * ==================================================
   * 11. CEP / VIA CEP
   * ==================================================
   */

  try {
    const response = await request(
      "GET",
      `/shipping/cep?cep=${TEST_CEP}`,
    );

    const cepData = getData(response);

    if (
      response.ok &&
      cepData
    ) {
      pass(
        "CEP lookup / ViaCEP",
        `HTTP ${response.status}`,
      );
    } else {
      fail(
        "CEP lookup / ViaCEP",
        `HTTP ${response.status} - ${getErrorMessage(response)}`,
      );
    }
  } catch (error) {
    fail(
      "CEP lookup / ViaCEP",
      error instanceof Error
        ? error.message
        : String(error),
    );
  }

  /*
   * ==================================================
   * 12. SHIPPING QUOTE
   * ==================================================
   */

  let shippingAvailable = false;

  try {
    const response = await request(
      "POST",
      "/shipping/quote",
      {
        destinationCep: TEST_CEP,
        items: [
          {
            productVariantId: variant.id,
            quantity: 2,
          },
        ],
      },
    );

    if (response.ok) {
      shippingAvailable = true;

      pass(
        "Shipping quote",
        `HTTP ${response.status}`,
      );
    } else {
      fail(
        "Shipping quote",
        `HTTP ${response.status} - ${getErrorMessage(response)}`,
      );
    }
  } catch (error) {
    fail(
      "Shipping quote",
      error instanceof Error
        ? error.message
        : String(error),
    );
  }

  /*
   * ==================================================
   * 13. CREATE ORDER
   * ==================================================
   */

  if (!shippingAvailable) {
    skip(
      "Create order",
      "Shipping quote unavailable",
    );

    skip(
      "Stock reservation",
      "Order was not created",
    );

    skip(
      "Payment tests",
      "Order was not created",
    );

    log("");
    log("========================================");
    log("SUMMARY");
    log("========================================");

    const passCount = results.filter(
      (line) => line.startsWith("PASS"),
    ).length;

    const failCount = results.filter(
      (line) => line.startsWith("FAIL"),
    ).length;

    const skipCount = results.filter(
      (line) => line.startsWith("SKIP"),
    ).length;

    log(`PASS: ${passCount}`);
    log(`FAIL: ${failCount}`);
    log(`SKIP: ${skipCount}`);

    log("========================================");

    await saveResults();
    return;
  }

  try {
    const response = await request(
      "POST",
      "/orders",
      {
        customerId: customer.id,

        shippingAddress: {
          cep: TEST_CEP,
          street: "Rua Teste",
          number: "100",
          complement: "Teste automatizado",
          neighborhood: "Centro",
          city: "Volta Redonda",
          state: "RJ",
        },

        items: [
          {
            productVariantId: variant.id,
            quantity: 2,
          },
        ],
      },
    );

    if (
      response.status === 201 ||
      response.status === 200
    ) {
      order = getData(response);

      if (order?.id) {
        pass(
          "Create order",
          `HTTP ${response.status}`,
        );

        log(
          `INFO | Order ID: ${order.id}`,
        );
      } else {
        fail(
          "Create order",
          "Response did not contain order id",
        );
      }
    } else {
      fail(
        "Create order",
        `HTTP ${response.status} - ${getErrorMessage(response)}`,
      );
    }
  } catch (error) {
    fail(
      "Create order",
      error instanceof Error
        ? error.message
        : String(error),
    );
  }

  if (!order?.id) {
    skip(
      "Payment tests",
      "Order was not created",
    );

    await saveResults();
    return;
  }

  /*
   * ==================================================
   * 14. VERIFY STOCK AFTER ORDER
   * ==================================================
   */

  try {
    const response = await request(
      "GET",
      `/products/${product.id}/variants`,
    );

    const variants = getData(response);

    const currentVariant =
      Array.isArray(variants)
        ? variants.find(
            (item) => item.id === variant.id,
          )
        : null;

    if (
      response.ok &&
      currentVariant?.stock === 8
    ) {
      pass(
        "Stock reservation",
        "Stock changed from 10 to 8",
      );
    } else {
      fail(
        "Stock reservation",
        `Expected 8, received ${currentVariant?.stock}`,
      );
    }
  } catch (error) {
    fail(
      "Stock reservation",
      error instanceof Error
        ? error.message
        : String(error),
    );
  }

  /*
   * ==================================================
   * 15. GET ORDER
   * ==================================================
   */

  try {
    const response = await request(
      "GET",
      `/orders/${order.id}`,
    );

    const orderData = getData(response);

    if (
      response.ok &&
      orderData?.id === order.id &&
      orderData?.status === "pending" &&
      Array.isArray(orderData?.items) &&
      orderData.items.length === 1
    ) {
      pass(
        "Get order",
        `HTTP ${response.status}`,
      );
    } else {
      fail(
        "Get order",
        `HTTP ${response.status} - ${getErrorMessage(response)}`,
      );
    }
  } catch (error) {
    fail(
      "Get order",
      error instanceof Error
        ? error.message
        : String(error),
    );
  }

  /*
   * ==================================================
   * 16. CREATE PAYMENT
   * ==================================================
   */

  let paymentCreated = false;

  try {
    const response = await request(
      "POST",
      `/orders/${order.id}/payments`,
      {},
    );

    if (response.ok) {
      const paymentResponse = getData(response);

      /*
       * A resposta real do endpoint é:
       *
       * {
       *   payment: {...},
       *   checkoutUrl: "..."
       * }
       */

      payment =
        paymentResponse?.payment ?? null;

      if (payment?.id) {
        paymentCreated = true;

        pass(
          "Create payment",
          `HTTP ${response.status}`,
        );

        if (paymentResponse?.checkoutUrl) {
          log(
            "INFO | InfinitePay checkout URL generated",
          );
        } else {
          fail(
            "Create payment",
            "Payment was created without checkout URL",
          );
        }
      } else {
        fail(
          "Create payment",
          "Response did not contain payment id",
        );
      }
    } else {
      fail(
        "Create payment",
        `HTTP ${response.status} - ${getErrorMessage(response)}`,
      );
    }
  } catch (error) {
    fail(
      "Create payment",
      error instanceof Error
        ? error.message
        : String(error),
    );
  }

  /*
   * ==================================================
   * 17. GET ORDER PAYMENTS
   * ==================================================
   */

  try {
    const response = await request(
      "GET",
      `/orders/${order.id}/payments`,
    );

    const payments = getData(response);

    if (
      response.ok &&
      Array.isArray(payments)
    ) {
      const foundPayment =
        payment?.id
          ? payments.find(
              (item) => item.id === payment.id,
            )
          : null;

      if (foundPayment) {
        pass(
          "Get order payments",
          `HTTP ${response.status}`,
        );
      } else {
        fail(
          "Get order payments",
          "Created payment was not returned",
        );
      }
    } else {
      fail(
        "Get order payments",
        `HTTP ${response.status} - ${getErrorMessage(response)}`,
      );
    }
  } catch (error) {
    fail(
      "Get order payments",
      error instanceof Error
        ? error.message
        : String(error),
    );
  }

  /*
   * ==================================================
   * 18. INFINITEPAY WEBHOOK
   * ==================================================
   */

  let webhookProcessed = false;

  let webhookTransactionNsu = null;

  if (!paymentCreated) {
    skip(
      "InfinitePay webhook",
      "Payment was not created",
    );

    skip(
      "Paid order status",
      "Payment was not created",
    );

    skip(
      "Paid payment status",
      "Payment was not created",
    );

    skip(
      "InfinitePay webhook idempotency",
      "Payment was not created",
    );
  } else {
    try {
      webhookTransactionNsu =
        `TEST-${Date.now()}`;

      const webhookPayload = {
        invoice_slug:
          `test-invoice-${Date.now()}`,

        amount:
          order.totalInCents,

        paid_amount:
          order.totalInCents,

        installments: 1,

        capture_method: "pix",

        transaction_nsu:
          webhookTransactionNsu,

        order_nsu:
          order.id,

        receipt_url:
          "https://example.com/receipt/test",

        items: [
          {
            quantity: 2,
            price: 5990,
            description:
              "Produto Teste - Preta - M",
          },
        ],
      };

      const response = await request(
        "POST",
        "/webhooks/infinitepay",
        webhookPayload,
      );

      if (
        response.ok &&
        response.data?.success === true
      ) {
        webhookProcessed = true;

        pass(
          "InfinitePay webhook",
          `HTTP ${response.status}`,
        );
      } else {
        fail(
          "InfinitePay webhook",
          `HTTP ${response.status} - ${getErrorMessage(response)}`,
        );
      }
    } catch (error) {
      fail(
        "InfinitePay webhook",
        error instanceof Error
          ? error.message
          : String(error),
      );
    }

    /*
     * ==================================================
     * 19. VERIFY PAID ORDER
     * ==================================================
     */

    if (webhookProcessed) {
      try {
        const response = await request(
          "GET",
          `/orders/${order.id}`,
        );

        const orderData =
          getData(response);

        if (
          response.ok &&
          orderData?.id === order.id &&
          orderData?.status === "paid"
        ) {
          pass(
            "Paid order status",
            "Order changed from pending to paid",
          );
        } else {
          fail(
            "Paid order status",
            `Expected paid, received ${orderData?.status}`,
          );
        }
      } catch (error) {
        fail(
          "Paid order status",
          error instanceof Error
            ? error.message
            : String(error),
        );
      }
    }

    /*
     * ==================================================
     * 20. VERIFY PAID PAYMENT
     * ==================================================
     */

    if (
      webhookProcessed &&
      payment?.id
    ) {
      try {
        const response = await request(
          "GET",
          `/payments/${payment.id}`,
        );

        const paymentData =
          getData(response);

        if (
          response.ok &&
          paymentData?.id === payment.id &&
          paymentData?.status === "paid" &&
          paymentData?.provider ===
            "infinitepay" &&
          paymentData?.transactionNsu ===
            webhookTransactionNsu
        ) {
          pass(
            "Paid payment status",
            "Payment marked as paid",
          );
        } else {
          fail(
            "Paid payment status",
            `HTTP ${response.status} - Payment status: ${paymentData?.status}`,
          );
        }
      } catch (error) {
        fail(
          "Paid payment status",
          error instanceof Error
            ? error.message
            : String(error),
        );
      }
    }

    /*
     * ==================================================
     * 21. WEBHOOK IDEMPOTENCY
     * ==================================================
     */

    if (webhookProcessed) {
      try {
        const webhookPayload = {
          invoice_slug:
            `test-invoice-${Date.now()}`,

          amount:
            order.totalInCents,

          paid_amount:
            order.totalInCents,

          installments: 1,

          capture_method: "pix",

          transaction_nsu:
            webhookTransactionNsu,

          order_nsu:
            order.id,

          receipt_url:
            "https://example.com/receipt/test",

          items: [
            {
              quantity: 2,
              price: 5990,
              description:
                "Produto Teste - Preta - M",
            },
          ],
        };

        const response = await request(
          "POST",
          "/webhooks/infinitepay",
          webhookPayload,
        );

        if (
          response.ok &&
          response.data?.success === true
        ) {
          pass(
            "InfinitePay webhook idempotency",
            "Duplicate webhook accepted safely",
          );
        } else {
          fail(
            "InfinitePay webhook idempotency",
            `HTTP ${response.status} - ${getErrorMessage(response)}`,
          );
        }
      } catch (error) {
        fail(
          "InfinitePay webhook idempotency",
          error instanceof Error
            ? error.message
            : String(error),
        );
      }
    }
  }

  /*
   * ==================================================
   * 22. CREATE SECOND ORDER
   * ==================================================
   */

  let cancellationOrder = null;

  try {
    const response = await request(
      "POST",
      "/orders",
      {
        customerId: customer.id,

        shippingAddress: {
          cep: TEST_CEP,
          street: "Rua Teste",
          number: "100",
          complement:
            "Teste de cancelamento",
          neighborhood: "Centro",
          city: "Volta Redonda",
          state: "RJ",
        },

        items: [
          {
            productVariantId: variant.id,
            quantity: 1,
          },
        ],
      },
    );

    if (
      response.status === 201 ||
      response.status === 200
    ) {
      cancellationOrder =
        getData(response);

      if (cancellationOrder?.id) {
        pass(
          "Create cancellation test order",
          `HTTP ${response.status}`,
        );

        log(
          `INFO | Cancellation Order ID: ${cancellationOrder.id}`,
        );
      } else {
        fail(
          "Create cancellation test order",
          "Response did not contain order id",
        );
      }
    } else {
      fail(
        "Create cancellation test order",
        `HTTP ${response.status} - ${getErrorMessage(response)}`,
      );
    }
  } catch (error) {
    fail(
      "Create cancellation test order",
      error instanceof Error
        ? error.message
        : String(error),
    );
  }

  /*
   * ==================================================
   * 23. VERIFY SECOND STOCK RESERVATION
   * ==================================================
   */

  if (cancellationOrder?.id) {
    try {
      const response = await request(
        "GET",
        `/products/${product.id}/variants`,
      );

      const variants = getData(response);

      const currentVariant =
        Array.isArray(variants)
          ? variants.find(
              (item) => item.id === variant.id,
            )
          : null;

      if (
        response.ok &&
        currentVariant?.stock === 7
      ) {
        pass(
          "Second stock reservation",
          "Stock changed from 8 to 7",
        );
      } else {
        fail(
          "Second stock reservation",
          `Expected 7, received ${currentVariant?.stock}`,
        );
      }
    } catch (error) {
      fail(
        "Second stock reservation",
        error instanceof Error
          ? error.message
          : String(error),
      );
    }
  } else {
    skip(
      "Second stock reservation",
      "Cancellation order was not created",
    );
  }

  /*
   * ==================================================
   * 24. CANCEL SECOND ORDER
   * ==================================================
   */

  if (!cancellationOrder?.id) {
    skip(
      "Cancel order",
      "Cancellation order was not created",
    );

    skip(
      "Cancelled order status",
      "Cancellation order was not created",
    );

    skip(
      "Stock restoration",
      "Cancellation order was not created",
    );

    skip(
      "Cancel already cancelled order",
      "Cancellation order was not created",
    );
  } else {
    try {
      const response = await request(
        "PATCH",
        `/orders/${cancellationOrder.id}/cancel`,
      );

      if (response.ok) {
        pass(
          "Cancel order",
          `HTTP ${response.status}`,
        );
      } else {
        fail(
          "Cancel order",
          `HTTP ${response.status} - ${getErrorMessage(response)}`,
        );
      }
    } catch (error) {
      fail(
        "Cancel order",
        error instanceof Error
          ? error.message
          : String(error),
      );
    }

    /*
     * ==================================================
     * 25. VERIFY CANCELLED ORDER
     * ==================================================
     */

    try {
      const response = await request(
        "GET",
        `/orders/${cancellationOrder.id}`,
      );

      const orderData =
        getData(response);

      if (
        response.ok &&
        orderData?.status === "cancelled"
      ) {
        pass(
          "Cancelled order status",
          "Order is cancelled",
        );
      } else {
        fail(
          "Cancelled order status",
          `Expected cancelled, received ${orderData?.status}`,
        );
      }
    } catch (error) {
      fail(
        "Cancelled order status",
        error instanceof Error
          ? error.message
          : String(error),
      );
    }

    /*
     * ==================================================
     * 26. VERIFY STOCK RESTORATION
     * ==================================================
     */

    try {
      const response = await request(
        "GET",
        `/products/${product.id}/variants`,
      );

      const variants = getData(response);

      const currentVariant =
        Array.isArray(variants)
          ? variants.find(
              (item) => item.id === variant.id,
            )
          : null;

      if (
        response.ok &&
        currentVariant?.stock === 8
      ) {
        pass(
          "Stock restoration",
          "Stock returned from 7 to 8",
        );
      } else {
        fail(
          "Stock restoration",
          `Expected 8, received ${currentVariant?.stock}`,
        );
      }
    } catch (error) {
      fail(
        "Stock restoration",
        error instanceof Error
          ? error.message
          : String(error),
      );
    }

    /*
     * ==================================================
     * 27. CANCEL AGAIN
     * ==================================================
     */

    try {
      const response = await request(
        "PATCH",
        `/orders/${cancellationOrder.id}/cancel`,
      );

      if (response.ok) {
        pass(
          "Cancel already cancelled order",
          "Idempotent cancellation",
        );
      } else {
        fail(
          "Cancel already cancelled order",
          `HTTP ${response.status} - ${getErrorMessage(response)}`,
        );
      }
    } catch (error) {
      fail(
        "Cancel already cancelled order",
        error instanceof Error
          ? error.message
          : String(error),
      );
    }
  }

  /*
   * ==================================================
   * SUMMARY
   * ==================================================
   */

  log("");
  log("========================================");
  log("SUMMARY");
  log("========================================");

  const passCount = results.filter(
    (line) => line.startsWith("PASS"),
  ).length;

  const failCount = results.filter(
    (line) => line.startsWith("FAIL"),
  ).length;

  const skipCount = results.filter(
    (line) => line.startsWith("SKIP"),
  ).length;

  log(`PASS: ${passCount}`);
  log(`FAIL: ${failCount}`);
  log(`SKIP: ${skipCount}`);

  log("========================================");

  await saveResults();
}

run().catch(async (error) => {
  const message =
    error instanceof Error
      ? error.stack ?? error.message
      : String(error);

  console.error(message);

  results.push("");
  results.push("UNEXPECTED ERROR");
  results.push(message);

  await fs.writeFile(
    OUTPUT_FILE,
    results.join("\n"),
    "utf8",
  );

  process.exitCode = 1;
});