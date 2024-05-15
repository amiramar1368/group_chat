import Redis from "ioredis";

export const redis = new Redis();

export const saveMassageTemproryInRedis = async (key, value) => {
  if (!(await redis.exists(key))) {
    redis.set(key, "[]");
  }
  let existsMessage = await redis.get(key);
  existsMessage = JSON.parse(existsMessage);
  existsMessage.push(value);
  await redis.set(key, JSON.stringify(existsMessage));
  await redis.persist(key,()=>{})
  return true;
};
