export const CLIENT_ID = ""; // Todo: setup client id
export const TOKEN = ""; // Todo: setup token

export const NEW_API_ENDPOINT =
  "https://askrobot.azurewebsites.net";

const supportedCountries = ["il", "am", "ge", "pt", "rs", "tr", "ae", "lt", "es", "th", "de", "sa", "ar", "kz", "uz", "id", "ie", "me"];

export const getIsChatRendered = (id: string) => {
  return supportedCountries.includes(id);
}

export function removeNumbersAndParentheses(text) {
  return text.replace(/\[\d+\],?/g, '').replace(/[()]/g, '');
}

export function replaceLinks(text, links) {
  const regex = /\[(\d+)\]/g;

  const replacedText = text.replace(regex, (match, number) => {
    const linkValue = links[number]?.url;
    return linkValue ? linkValue : match;
  });

  return replacedText;
}
