import { RefClickModel } from "./models/ref-click.model";
import { refClickKey } from "#shared/utils/ref-clicks";

const DUPLICATE_KEY = 11000;

export class RefClickRepository implements IRefClickRepository {
  async increment(domain: string, day: string) {
    const run = () =>
      RefClickModel.updateOne(
        { _id: refClickKey(domain, day) },
        { $inc: { count: 1 }, $setOnInsert: { domain, day } },
        { upsert: true },
      );

    try {
      await run();
    } catch (error: any) {
      // Два первых клика дня одновременно: оба upsert'а идут на вставку, второй
      // упирается в `_id`. Повтор уже попадает в существующий документ.
      if (error?.code !== DUPLICATE_KEY) {
        throw error;
      }
      await run();
    }
  }
}
