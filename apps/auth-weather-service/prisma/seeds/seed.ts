import { PrismaClient, CityWeather } from '@prisma/client';
import { hash } from 'node:crypto';

import { DatesHelper } from '../../../../common/helpers/dates.helper';
import { NumbersHelper } from '../../../../common/helpers/numbers.helper';
import { cities, stableDate, users, weatherConditions } from './data/data';

type UploadCityWeatherType = Pick<
  CityWeather,
  'cityId' | 'weatherCondition' | 'weatherDate'
>;

const prisma = new PrismaClient();

// Might be separated to files
async function main() {
  await Promise.all([prisma.user.deleteMany(), prisma.city.deleteMany()]);

  await Promise.all([
    prisma.user.createMany({
      data: users.map(({ email, password }) => ({
        email,
        password: hash('sha256', password, 'hex'), // Salt might be added
      })),
    }),
    prisma.city.createMany({
      data: cities,
    }),
  ]);

  const citiesFromDB = await prisma.city.findMany({ select: { id: true } });

  const cityWeathersToUpload: UploadCityWeatherType[] = [];

  citiesFromDB.forEach((city) => {
    // Magic numbers. Might be described
    for (let i = 0; i < NumbersHelper.getRandomNumber(3, 10); i++) {
      cityWeathersToUpload.push({
        cityId: city.id,
        weatherCondition:
          weatherConditions[
            NumbersHelper.getRandomNumber(2, weatherConditions.length) // Magic numbers. Might be described
          ],
        weatherDate: DatesHelper.getRandomDate(
          new Date('2023-09-01T01:00:00.462Z'),
          new Date('2024-09-01T01:00:00.462Z'),
        ),
      });

      cityWeathersToUpload.push({
        cityId: city.id,
        weatherCondition:
          weatherConditions[
            NumbersHelper.getRandomNumber(2, weatherConditions.length)
          ],
        weatherDate: stableDate,
      });
    }
  });

  await prisma.cityWeather.createMany({
    data: cityWeathersToUpload,
  });

  console.log('Seeds were uploaded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
