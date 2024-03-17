const express = require("express");
const app = express();
const PORT = 3000;
const pool = require("./db");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello Express");
});

// ユーザー情報を全て取得する
app.get("/users", (req, res) => {
  pool.query("SELECT * FROM users", (error, results) => {
    if (error) throw error;
    return res.status(200).json(results.rows);
  });
});

// 特定のユーザーを取得する
app.get("/users/:id", (req, res) => {
  const id = req.params.id;

  pool.query("SELECT * FROM users WHERE id = $1", [id], (error, results) => {
    if (error) throw error;
    return res.status(200).json(results.rows);
  });
});

// ユーザーを追加する
app.post("/users", (req, res) => {
  const { name, email, age } = req.body;
  // ユーザーが既に存在しているかどうか確認
  pool.query(
    "SELECT s FROM users s WHERE s.email = $1",
    [email],
    (error, results) => {
      if (results.rows.length) {
        return res.send("既にユーザーが存在しています");
      }

      if (!name || !email || !age) {
        return res.send("未入力があります");
      }

      pool.query(
        "INSERT INTO users(name, email, age) values($1, $2, $3)",
        [name, email, age],
        (error, results) => {
          if (error) throw error;
          return res.status(201).send("ユーザー作成に成功しました");
        }
      );
    }
  );
});

// ユーザーを削除する
app.delete("/users/:id", (req, res) => {
  const id = req.params.id;

  pool.query("SELECT * FROM users WHERE id = $1", [id], (error, results) => {
    if (error) throw error;

    if (!results.rows.length) {
      return res.send("ユーザーが存在しません");
    }

    pool.query("DELETE FROM users WHERE id = $1", [id], (error, results) => {
      if (error) throw error;
      return res.status(200).send("削除に成功しました");
    });
  });
});

// ユーザーの名前を更新する
app.put("/users/:id", (req, res) => {
  const id = req.params.id;
  const name = req.body.name;

  pool.query("SELECT * FROM users WHERE id = $1", [id], (error, results) => {
    if (error) throw error;

    if (!results.rows.length) {
      return res.send("ユーザーが存在しません");
    }

    pool.query(
      "UPDATE users SET name = $1 WHERE id = $2",
      [name, id],
      (error, results) => {
        if (error) throw error;
        return res.status(200).send("更新に成功しました");
      }
    );
  });
});

app.listen(PORT, () => {
  console.log(`sever is running on PORT ${PORT}`);
});
