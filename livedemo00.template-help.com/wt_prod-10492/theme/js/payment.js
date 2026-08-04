(() => {
  "use strict";

  const form = document.getElementById("paymentForm");
  const planInputs = [...document.querySelectorAll('input[name="plan"]')];

  const cardFields = document.getElementById("cardFields");
  const cardNumber = document.getElementById("cardNumber");
  const expiryDate = document.getElementById("expiryDate");
  const cvc = document.getElementById("cvc");
  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  const terms = document.getElementById("terms");

  const summaryPlan = document.getElementById("summaryPlan");
  const summaryPrice = document.getElementById("summaryPrice");
  const submitButton = document.getElementById("submitButton");
  const submitButtonText = document.getElementById("submitButtonText");
  const formAlert = document.getElementById("formAlert");

  const mobileMenuButton = document.getElementById("mobileMenuButton");
  const paymentNav = document.getElementById("paymentNav");


  /* =====================================================
     MOBILE NAVIGATION
  ====================================================== */
  mobileMenuButton?.addEventListener("click", () => {
    const isOpen = paymentNav.classList.toggle("is-open");
    mobileMenuButton.setAttribute("aria-expanded", String(isOpen));
  });


  /* =====================================================
     HELPERS
  ====================================================== */
  const getSelectedPlan = () => {
    const selected = planInputs.find((input) => input.checked);

    return {
      id: selected.value,
      name: selected.dataset.name,
      price: Number(selected.dataset.price)
    };
  };

  const formatMoney = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(value);
  };

  const onlyDigits = (value) => value.replace(/\D/g, "");

  const normalizeName = (value) => {
    return value.trim().replace(/\s+/g, " ");
  };

  const showMessage = (field, message, type = "error") => {
    const messageElement = document.getElementById(`${field.id}Error`);

    field.classList.remove("is-valid", "is-invalid");
    messageElement.classList.remove("is-success");

    if (!message) {
      messageElement.textContent = "";
      return;
    }

    messageElement.textContent = message;

    if (type === "success") {
      field.classList.add("is-valid");
      messageElement.classList.add("is-success");
    } else {
      field.classList.add("is-invalid");
    }
  };

  const clearFieldState = (field) => {
    const messageElement = document.getElementById(`${field.id}Error`);

    field.classList.remove("is-valid", "is-invalid");

    if (messageElement) {
      messageElement.textContent = "";
      messageElement.classList.remove("is-success");
    }
  };

  const showAlert = (message, type) => {
    formAlert.className = `form-alert is-visible is-${type}`;
    formAlert.textContent = message;
  };

  const clearAlert = () => {
    formAlert.className = "form-alert";
    formAlert.textContent = "";
  };


  /* =====================================================
     LUHN ALGORITHM
     Checks whether the card number has a valid checksum.
     It does not prove that the card exists or has funds.
  ====================================================== */
  const passesLuhn = (cardValue) => {
    const digits = onlyDigits(cardValue);

    if (digits.length < 13 || digits.length > 19) {
      return false;
    }

    let sum = 0;
    let shouldDouble = false;

    for (let index = digits.length - 1; index >= 0; index -= 1) {
      let digit = Number(digits[index]);

      if (shouldDouble) {
        digit *= 2;

        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
  };


  /* =====================================================
     VALIDATORS
  ====================================================== */
  const validateCardNumber = () => {
    const digits = onlyDigits(cardNumber.value);

    if (!digits) {
      showMessage(cardNumber, "Enter your card number.");
      return false;
    }

    if (digits.length < 13 || digits.length > 19) {
      showMessage(cardNumber, "The card number must contain 13 to 19 digits.");
      return false;
    }

    if (!passesLuhn(digits)) {
      showMessage(cardNumber, "The card number is not valid.");
      return false;
    }

    showMessage(cardNumber, "Valid card number.", "success");
    return true;
  };


  const validateExpiry = () => {
    const match = expiryDate.value.match(/^(\d{2})\s*\/\s*(\d{2})$/);

    if (!match) {
      showMessage(expiryDate, "Use the MM / YY format.");
      return false;
    }

    const month = Number(match[1]);
    const year = 2000 + Number(match[2]);

    if (month < 1 || month > 12) {
      showMessage(expiryDate, "Enter a valid month between 01 and 12.");
      return false;
    }

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const hasExpired =
      year < currentYear ||
      (year === currentYear && month < currentMonth);

    if (hasExpired) {
      showMessage(expiryDate, "This card has expired.");
      return false;
    }

    if (year > currentYear + 25) {
      showMessage(expiryDate, "The expiration year is too far in the future.");
      return false;
    }

    showMessage(expiryDate, "Valid expiration date.", "success");
    return true;
  };


  const validateCvc = () => {
    const digits = onlyDigits(cvc.value);

    if (!/^\d{3,4}$/.test(digits)) {
      showMessage(cvc, "Enter a 3 or 4 digit security code.");
      return false;
    }

    showMessage(cvc, "Valid security code.", "success");
    return true;
  };


  const validateName = (field, label) => {
    const value = normalizeName(field.value);

    if (!value) {
      showMessage(field, `Enter the ${label}.`);
      return false;
    }

    if (value.length < 2) {
      showMessage(field, `The ${label} is too short.`);
      return false;
    }

    /*
      Supports letters, accents, apostrophes, hyphens and spaces.
      The fallback is included for older browsers.
    */
    let validCharacters = true;

    try {
      validCharacters = /^[\p{L}\p{M}' -]+$/u.test(value);
    } catch {
      validCharacters = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/.test(value);
    }

    if (!validCharacters) {
      showMessage(field, `The ${label} contains invalid characters.`);
      return false;
    }

    field.value = value;
    showMessage(field, `Valid ${label}.`, "success");
    return true;
  };


  const validateTerms = () => {
    const termsError = document.getElementById("termsError");

    if (!terms.checked) {
      termsError.textContent =
        "You must accept the Terms of Service and Privacy Policy.";
      return false;
    }

    termsError.textContent = "";
    return true;
  };


  const validatePaidPlan = () => {
    const validations = [
      validateCardNumber(),
      validateExpiry(),
      validateCvc(),
      validateName(firstName, "first name"),
      validateName(lastName, "last name"),
      validateTerms()
    ];

    return validations.every(Boolean);
  };


  const validateFreePlan = () => {
    return validateTerms();
  };


  /* =====================================================
     INPUT FORMATTING
  ====================================================== */
  cardNumber.addEventListener("input", () => {
    const digits = onlyDigits(cardNumber.value).slice(0, 19);
    cardNumber.value = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
    clearFieldState(cardNumber);
    clearAlert();
  });

  cardNumber.addEventListener("blur", () => {
    if (getSelectedPlan().price > 0) {
      validateCardNumber();
    }
  });


  expiryDate.addEventListener("input", () => {
    const digits = onlyDigits(expiryDate.value).slice(0, 4);

    if (digits.length <= 2) {
      expiryDate.value = digits;
    } else {
      expiryDate.value = `${digits.slice(0, 2)} / ${digits.slice(2)}`;
    }

    clearFieldState(expiryDate);
    clearAlert();
  });

  expiryDate.addEventListener("blur", () => {
    if (getSelectedPlan().price > 0) {
      validateExpiry();
    }
  });


  cvc.addEventListener("input", () => {
    cvc.value = onlyDigits(cvc.value).slice(0, 4);
    clearFieldState(cvc);
    clearAlert();
  });

  cvc.addEventListener("blur", () => {
    if (getSelectedPlan().price > 0) {
      validateCvc();
    }
  });


  firstName.addEventListener("input", () => {
    clearFieldState(firstName);
    clearAlert();
  });

  firstName.addEventListener("blur", () => {
    if (getSelectedPlan().price > 0) {
      validateName(firstName, "first name");
    }
  });


  lastName.addEventListener("input", () => {
    clearFieldState(lastName);
    clearAlert();
  });

  lastName.addEventListener("blur", () => {
    if (getSelectedPlan().price > 0) {
      validateName(lastName, "last name");
    }
  });


  terms.addEventListener("change", () => {
    if (terms.checked) {
      document.getElementById("termsError").textContent = "";
    }

    clearAlert();
  });


  /* =====================================================
     PLAN CHANGES
  ====================================================== */
  const updatePlanInterface = () => {
    const plan = getSelectedPlan();
    const isFree = plan.price === 0;

    summaryPlan.textContent = plan.name;
    summaryPrice.textContent = formatMoney(plan.price);

    submitButtonText.textContent = isFree
      ? `Activate ${plan.name} for ${formatMoney(plan.price)}`
      : `Pay ${formatMoney(plan.price)} for ${plan.name}`;

    cardFields.classList.toggle("is-disabled", isFree);

    [cardNumber, expiryDate, cvc, firstName, lastName].forEach((field) => {
      field.disabled = isFree;
      field.required = !isFree;

      if (isFree) {
        clearFieldState(field);
      }
    });

    clearAlert();
  };

  planInputs.forEach((input) => {
    input.addEventListener("change", updatePlanInterface);
  });


  /* =====================================================
     FORM SUBMISSION
  ====================================================== */
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearAlert();

    const plan = getSelectedPlan();
    const isValid =
      plan.price === 0 ? validateFreePlan() : validatePaidPlan();

    if (!isValid) {
      showAlert(
        "Please review the highlighted fields before continuing.",
        "error"
      );

      const firstInvalid = form.querySelector(
        ".is-invalid, #terms:not(:checked)"
      );

      firstInvalid?.focus();
      return;
    }

    submitButton.disabled = true;
    submitButtonText.textContent =
      plan.price === 0 ? "Activating plan..." : "Validating payment...";

    /*
      Demo delay only.

      IMPORTANT:
      No real payment is processed here. For production, replace this block
      with a secure Stripe Payment Element / Checkout integration and create
      the PaymentIntent or Checkout Session on your server.
    */
    await new Promise((resolve) => setTimeout(resolve, 900));

    if (plan.price === 0) {
      showAlert(
        `Success! The ${plan.name} plan has been selected at ${formatMoney(
          plan.price
        )}.`,
        "success"
      );
    } else {
      showAlert(
        `The information passed the browser validation for the ${plan.name} plan (${formatMoney(
          plan.price
        )}). No real charge was made.`,
        "success"
      );
    }

    submitButton.disabled = false;
    updatePlanInterface();
  });


  updatePlanInterface();
})();
