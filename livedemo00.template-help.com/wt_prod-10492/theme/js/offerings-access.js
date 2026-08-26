import {
  PLAN_LEVELS,
  getCurrentSession,
  getPlanLabel
} from "./plan-manager.js";

const requiredPlan = new URLSearchParams(window.location.search).get("required");
const messages = Object.freeze({
  sprout: {
    title: "A verified Hydronexis account is required",
    text: "Sign in again to verify your Sprout plan before opening the Marketplace and purchase tools."
  },
  blooming: {
    title: "This feature requires Blooming",
    text: "Upgrade to Blooming or Go Green to unlock this area. Compare the plans below and choose the access level that fits you."
  },
  go_green: {
    title: "This feature is exclusive to Go Green",
    text: "Seller and premium tools are available with Go Green. Marketplace browsing remains available on every account plan."
  }
});

const message = messages[requiredPlan];
if (message) {
  const notice = document.getElementById("plan-access-notice");
  const title = document.getElementById("plan-access-notice-title");
  const text = document.getElementById("plan-access-notice-text");
  if (notice && title && text) {
    title.textContent = message.title;
    text.textContent = message.text;
    notice.hidden = false;
    notice.focus({ preventScroll: true });
  }
}

const session = await getCurrentSession();
document.querySelectorAll("[data-plan-choice]").forEach((link) => {
  const targetPlan = link.dataset.planChoice;
  if (!session.user) {
    link.href = targetPlan === "sprout"
      ? "login.html?mode=signup"
      : `payment.html?plan=${targetPlan}`;
    return;
  }

  if (PLAN_LEVELS[session.plan] >= PLAN_LEVELS[targetPlan]) {
    link.href = "Dashboard2.html";
    link.setAttribute(
      "aria-label",
      targetPlan === session.plan
        ? `${getPlanLabel(targetPlan)} is your current plan; open Dashboard`
        : `${getPlanLabel(targetPlan)} is included; open Dashboard`
    );
  } else {
    link.href = `payment.html?plan=${targetPlan}`;
  }
});
