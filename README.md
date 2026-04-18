# Photo Sharing Server - TH2

TH2 da duoc chuyen thanh backend project theo cau truc cua CodeSandbox ban gui.

## Cau truc

- `index.js`: entrypoint cua Express server.
- `routes/`: khai bao REST API.
- `modelData/`: du lieu mau va ham truy van.
- `db/`: cau hinh ket noi co san de mo rong theo kieu sandbox.

## Chay du an

```bash
npm install
npm start
```

Mac dinh server chay o `http://localhost:3001`.

## API hien co

- `GET /test/info`
- `GET /user/list`
- `GET /user/:id`
- `GET /photosOfUser/:id`

## Ghi chu

- `TH2` hien la ban backend-doc-lap.
- Du lieu dang duoc phuc vu tu bo du lieu mau noi bo.
- Co san `dotenv` va `mongoose` de sau nay mo rong giong sandbox neu can.
