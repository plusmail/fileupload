const express = require('express')
const cors = require("cors")
const app = express()
const fs = require("fs");  //폴더 생성할때
const multer = require('multer');
const path = require('path');

const DIR = '/opt/ejabberd/upload/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const {userid} = req.params;
        //폴더없으면 폴더 생성
        if (!fs.existsSync(DIR+userid)) {
            fs.mkdirSync(DIR+userid, { recursive: true });
        }

        cb(null, DIR+userid);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        const originalName = file.originalname;
        const date = new Date();
        const formattedDate = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
        const formattedTime = `${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}${date.getSeconds().toString().padStart(2, '0')}`;
        const fileNameDate = `file_${formattedDate}_${formattedTime}_${originalName}`;
        cb(null, fileNameDate)
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

app.use(cors())

app.post('/single/upload', upload.single('file'), (req, res, next) => {

    const {fieldname, originalname, encoding, mimetype, destination, filename, path, size} = req.files
    const {id} = req.body.id;

    console.log("body 데이터 : ", id);
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
app.post('/multipart/upload/:userid', upload.array('imgCollection', 6), (req, res, next) => {

    const {userid} = req.params;
    // console.log("데이터 1---: ", req.body);
    console.log("데이터 2---: ", req.files);

    const filename =[];

    //배열 형태이기 때문에 반복문을 통해 파일 정보를 알아낸다.
    req.files.map((data,i)=> {
        console.log("폼에 정의된 필드명 : ", data.fieldname);
        console.log("사용자가 업로드한 파일 명 : ", data.originalname);
        console.log("파일의 엔코딩 타입 : ", data.encoding);
        console.log("파일의 Mime 타입 : ", data.mimetype);
        console.log("파일이 저장된 폴더 : ", data.destination);
        console.log("destinatin에 저장된 파일 명 : ", data.filename);
        console.log("업로드된 파일의 전체 경로 ", data.path);
        console.log("파일의 바이트(byte 사이즈)", data.size);
        filename[i]=data.filename;
    })

    console.log("데이터 3---: ", filename);

    res.json({data: filename})

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
    {name: 'file1', maxCount: 1},
    {name: 'file2', maxCount: 8},
]);

app.post('/fields/upload', fileFields, (req, res, next) => {


    const {file1, file2} = req.files;
    const {name} = req.body;


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
