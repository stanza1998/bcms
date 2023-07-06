const getRandomInt = (min: number = 0, max: number = 36) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
};

export const OrderIdGenerator = (): string => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "0123456789";
  const acceptableCharacters = alphabet + digits;
  const len = acceptableCharacters.length;

  // OrderId: YY-MM-DD-UID
  const date = new Date().toISOString().slice(0, 10);
  const uid = `${acceptableCharacters.charAt(
    getRandomInt(0, len)
  )}${acceptableCharacters.charAt(getRandomInt(0, len))}`;
  return `${date}-${uid}`;
};
