const express = require('express')
const cors = require("cors")
const app = express()

/**
 * Multer 미들웨어는 파일 업로드를 위해 사용되는 multipart/form-data에서 사용된다.
 * 다른 폼으로 데이터를 전송하면 적용이 안된다.
 * Header의 명시해서 보내주는게 좋다.
 */
const multer  = require('multer')

//파일을 저장할 디렉토리 설정 (현재 위치에 uploads라는 폴더가 생성되고 하위에 파일이 생성된다.)
const upload = multer({
    dest: __dirname+'/uploads/', // 이미지 업로드 경로
})

app.use(cors())// Test를 하기 위해서 세팅 "실제 서버에 배포할 때는 아이피를 설정 해야된다."

/**
 * @author Ryan
 * @description 단일 파일 업로드
 *
 * 클라이언트에서 file이라는 Key(fieldname) 값을 통해 파일을 전송하면 req.file 안에 파일 정보를 얻을 수 있다.
 *
 * 단일 이미지 전송이기 때문에 여러 파일을 보내게 되면 에러가 발생된다.
 *
 */
app.post('/single/upload', upload.single('file'), (req, res, next) => {

    const { fieldname, originalname, encoding, mimetype, destination, filename, path, size } = req.file
    const { name } = req.body;

    console.log("body 데이터 : ", name);
    console.log("폼에 정의된 필드명 : ", fieldname);
    console.log("사용자가 업로드한 파일 명 : ", originalname);
    console.log("파일의 엔코딩 타입 : ", encoding);
    console.log("파일의 Mime 타입 : ", mimetype);
    console.log("파일이 저장된 폴더 : ", destination);
    console.log("destinatin에 저장된 파일 명 : ", filename);
    console.log("업로드된 파일의 전체 경로 ", path);
    console.log("파일의 바이트(byte 사이즈)", size);

    res.json({ok: true, data: "Single Upload Ok"})

})

/**
 * @author Ryan
 * @description 여러 파일 업로드
 *
 * 클라이언트에서 file이라는 Key(fieldname) 값을 통해 파일을 전송하면 req.files 안에 파일 정보를 배열([]) 형태로 얻을 수 있다.
 *
 * array('fieldname', maxCount) 필드 이름과 최대 파일 수를 정합니다.
 * 지정된 수 보다 더 많은 파일을 업로드하면 에러가 발생합니다.
 */
app.post('/multipart/upload', upload.array('file'), (req, res, next) => {

    const { name } = req.body;
    console.log("body 데이터 : ", name);

    //배열 형태이기 때문에 반복문을 통해 파일 정보를 알아낸다.
    req.files.map(data => {
        console.log("폼에 정의된 필드명 : ", data.fieldname);
        console.log("사용자가 업로드한 파일 명 : ", data.originalname);
        console.log("파일의 엔코딩 타입 : ", data.encoding);
        console.log("파일의 Mime 타입 : ", data.mimetype);
        console.log("파일이 저장된 폴더 : ", data.destination);
        console.log("destinatin에 저장된 파일 명 : ", data.filename);
        console.log("업로드된 파일의 전체 경로 ", data.path);
        console.log("파일의 바이트(byte 사이즈)", data.size);
    })

    res.json({ok: true, data: "Multipart Upload Ok"})

})
/**
 * @author Ryan
 * @description 단일 및 여러 파일 업로드
 *
 * fields를 설정해서 특정 파일은 단일 또는 여러 파일 그리고 특정 파일을 나눠서 업로드가 가능하다.
 *
 * Ex) 클라이언트가 요청할 때 pdf 파일은 한개를 받고 이미지 파일은 여러개를 받는 상황
 *     이런식으로 정의해서 사용할 수 있다.
 */
const fileFields = upload.fields([
    { name: 'file1', maxCount: 1 },
    { name: 'file2', maxCount: 8 },
]);

app.post('/fields/upload', fileFields, (req, res, next) => {


    const { file1, file2 } = req.files;
    const { name } = req.body;


    console.log("body 데이터 : ", name);

    //배열 형태이기 때문에 반복문을 통해 파일 정보를 알아낸다.
    file1.map(data => {
        console.log("file1");
        console.log("     ");
        console.log("폼에 정의된 필드명 : ", data.fieldname);
        console.log("사용자가 업로드한 파일 명 : ", data.originalname);
        console.log("파일의 엔코딩 타입 : ", data.encoding);
        console.log("파일의 Mime 타입 : ", data.mimetype);
        console.log("파일이 저장된 폴더 : ", data.destination);
        console.log("destinatin에 저장된 파일 명 : ", data.filename);
        console.log("업로드된 파일의 전체 경로 ", data.path);
        console.log("파일의 바이트(byte 사이즈)", data.size);
    })

    console.log("     ");
    console.log("-----------------------------------------------");
    console.log("     ");

    //배열 형태이기 때문에 반복문을 통해 파일 정보를 알아낸다.
    file2.map(data => {
        console.log("file2");
        console.log("     ");
        console.log("폼에 정의된 필드명 : ", data.fieldname);
        console.log("사용자가 업로드한 파일 명 : ", data.originalname);
        console.log("파일의 엔코딩 타입 : ", data.encoding);
        console.log("파일의 Mime 타입 : ", data.mimetype);
        console.log("파일이 저장된 폴더 : ", data.destination);
        console.log("destinatin에 저장된 파일 명 : ", data.filename);
        console.log("업로드된 파일의 전체 경로 ", data.path);
        console.log("파일의 바이트(byte 사이즈)", data.size);
    })

    res.json({ok: true, data: "Fields Upload Ok"})

})

app.listen(4000, () => console.log("Multer Server Start"));
