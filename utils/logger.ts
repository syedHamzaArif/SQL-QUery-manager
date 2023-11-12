export const logger = (type: string, message: any) => {
  console.log(`Type: ${type}\nMessage: ${JSON.stringify(message)}`);
};
