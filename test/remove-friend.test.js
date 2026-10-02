import assert from "node:assert/strict";
import test from "node:test";

process.env.POSTGRES_URL ||= "postgres://user:password@localhost:5432/test";

const { Op } = await import("sequelize");
const { removeFriendship } = await import("../routes/messaging.js");

function fakeFriendModel(friendship) {
  const calls = [];
  return {
    calls,
    async findOne(query) {
      calls.push(query);
      return friendship;
    },
  };
}

test("removing a friend deletes the accepted friendship in either direction", async () => {
  let destroyed = false;
  const model = fakeFriendModel({
    async destroy() {
      destroyed = true;
    },
  });

  const removed = await removeFriendship("me", "them", model);

  assert.equal(removed, true);
  assert.equal(destroyed, true);
  assert.equal(model.calls[0].where.status, "accepted");
  assert.deepEqual(model.calls[0].where[Op.or], [
    { requesterUuid: "me", addresseeUuid: "them" },
    { requesterUuid: "them", addresseeUuid: "me" },
  ]);
});

test("removing a friend reports false when there is no accepted friendship", async () => {
  const removed = await removeFriendship("me", "them", fakeFriendModel(null));

  assert.equal(removed, false);
});
