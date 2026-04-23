const https = require('https');
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, 'YouTube');

if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR);
}

// Danh sách URL mà subagent đã trích xuất
const emojis = [
    { name: '01_hardcarry', url: 'https://yt3.ggpht.com/sZRLX8m95dJm005Zyl8IEfVowX8BGEh13PVVaP-dFz9u1kvI1G_GUJ-tuynex195_tTDnYhLkq8=s128-c-k-nd' },
    { name: '02_hehhh', url: 'https://yt3.ggpht.com/PTtj5BogKfZyAt_OTTM_tLgO0fJ7xlxBDl8mcMGd5NElVHFmFBKSJAGP8S3gDyU3F9f6vu6elA=s128-c-k-nd' },
    { name: '03_lub', url: 'https://yt3.ggpht.com/kPQK5PDS9uhRPKyDYOqQWitsDnLZH-aTjTSWsPBnh5qLcyHMR-_Ul6w_3Bx0-7ly5019TxE9YA=s128-c-k-nd' },
    { name: '04_icant', url: 'https://yt3.ggpht.com/uqJWaOb3yzO_cYWrH-Zq6SKS0nVTNeMJs8LXZPpvo1uIoURwbNMrTfv4ZC3f4CQWUKHu2xknmQ=s128-c-k-nd' },
    { name: '05_HUH', url: 'https://yt3.ggpht.com/c3AV7kVmdaob4Q4_a09GLilg5UYsN5ILrCmMvEMVh36C62NJMoC91YuGRsPvbq5C4l1r4yCcuA=s128-c-k-nd' },
    { name: '06_hihi', url: 'https://yt3.ggpht.com/dmqfgwnFgg9JV3selI_P7-URv_MHlVka3q9og3WkHD7xHz0Wc6Xa2Dc5bnM0Q6nTpF0rXIfFA7s=s128-c-k-nd' },
    { name: '07_dog', url: 'https://yt3.ggpht.com/_0SZnmdaywTfxs6SG_5eBoA1Xe4klBD4WsGIZnb4XMIRZb9Np6Ll93HvS1smI_PGjZaSoPHYCw=s128-c-k-nd' },
    { name: '08_HYPERS', url: 'https://yt3.ggpht.com/I_9t1d91daLBw1u1pDErPeiSdqstoYt_DFR4JmzI5bcX8n0kNSxsTdKqeJZa7n41kpU9wys=s128-c-k-nd' },
    { name: '09_hiii', url: 'https://yt3.ggpht.com/IwlwWio6iKQMqynk4hM8p9a6mYQIWSz_jwMOzpMIVYf1ojdoJIh5IAoIFAemx8D_r5aYUsFSMw=s128-c-k-nd' },
    { name: '10_123', url: 'https://yt3.ggpht.com/_6xjT66FFhU3gtSL8z2WWYmcA7ItjZbR0PnrV6gf2405_xW-9CNSFt8J8_U35d1CuFEU8q1twA=s128-c-k-nd' },
    { name: '11_rbb', url: 'https://yt3.ggpht.com/Y1T7YVKGnaJA6ErngJek5Fn9mWhlXg_4SycJ2oMEo6IINr81h4_HYVq_LwbI2mmghRvMFYtv=s128-c-k-nd' },
    { name: '12_sad', url: 'https://yt3.ggpht.com/Tig_qikX-gliZkRcXTHTnXmdkSVu-F2k5W6k69Bhbh8Fc0zAbEGX74ScCJLV4L8a0m2JHsbBHAI=s128-c-k-nd' },
    { name: '13_wat', url: 'https://yt3.ggpht.com/u3gakzWeQ0AiTkK4UUd79Nj3tjyjQ_as_KwasDh_2GWgSndjVAKw62jsaxkFUV8XlsEqAr9imA=s128-c-k-nd' },
    { name: '14_nah', url: 'https://yt3.ggpht.com/-Y6eaPU1pb5e0dkj3tuq5Dcj02nJlKIqE6tkpGqoM40_xzUhTADR3_XouJlPCsaJqMcYum1FcA=s128-c-k-nd' },
    { name: '15_HAHAHA', url: 'https://yt3.ggpht.com/ejjTBs2aKIg2WVWOcjI8fvZD8-McEql_QyExz-Nz5vzwspFDtVj084oent79mMk5Uz5MzhKAMA=s128-c-k-nd' },
    { name: '16_222', url: 'https://yt3.ggpht.com/Zv6SH-k6cfN4wmEsKDht1mdVPrPvgNaoBxHBZikyoTbPZbqGwdXBkdnHbuZFRQymcup2itUP7g=s128-c-k-nd' },
    { name: '17_khungbo', url: 'https://yt3.ggpht.com/jGeSc2RjrPm269qUsfhavNy2akXdtE1J8DBAU7bXRcfcvYckULUko5JgOWx6-wIyO-uKRqMh=s128-c-k-nd' },
    { name: '18_cac', url: 'https://yt3.ggpht.com/Z1Wt7BtFsTV6uVOKc5CelKTPeXvHyC67HSWn9R9NKkSA4BT7uumo4LJnIuEZrs_w5JqhonQTyA=s128-c-k-nd' },
    { name: '19_sadd', url: 'https://yt3.ggpht.com/BA-E3EiIHZh508qfMqcFYoRJ0MogFJrR5YMuO1oEFs4RJHoW3Mq1v93flHdnBia5X6hrDwBuuIw=s128-c-k-nd' },
    { name: '20_hug', url: 'https://yt3.ggpht.com/uzCJw9Ur_QlpAnhbwGsfWwm66QifItH9EB_bXSIw0_yeO-v7RQzxrO5nFI2MifsIanVsx0unxuI=s128-c-k-nd' },
    { name: '21_zzzz', url: 'https://yt3.ggpht.com/z8-ZK1sJccUTn8uLbQ_4TmtijTUkqv2p3EgpSpxpqcj08WCFJgTbiHkfi_yCX8TnMUUk7Qk6=s128-c-k-nd' },
    { name: '22_333', url: 'https://yt3.ggpht.com/X_RDN-EVe0IE3hRRxCy-WZKZBLos43jObjunfuJMjRWPudW_TBFUieJ5dvz54o8E14TUCC9zDg=s128-c-k-nd' },
    { name: '23_tuh', url: 'https://yt3.ggpht.com/WHDmnBFfL4p96fFa-BjmDuscykVZy0YxcAZ_pNjJ_Ai4h23LhtwQZhw85V4SQ1-wboFd0slQ=s128-c-k-nd' },
    { name: '24_sajj', url: 'https://yt3.ggpht.com/MV9UoUCj8wpwFCoq1FP2_0vZHUg-VOZozrLrdMJQGG3-Hs8Foy1h6KzDuf84C21bOb3mxSp55Us=s128-c-k-nd' },
    { name: '25_ccc', url: 'https://yt3.ggpht.com/g-jzYw0nmrVjjtcbOM2oiBsqnPIDLO9kqcw8bMhDv6XzPhCVmy8jHJ7Z6vA9YrGTaqx8j2AhrTU=s128-c-k-nd' },
    { name: '26_tdan', url: 'https://yt3.ggpht.com/h5h9fXXukU-s4VixG9qt4LyRvVLkGQwokR4P2Xpm00LYnyvDNLQZHQucLl1SQDtjZGK3CtRRKw=s128-c-k-nd' },
    { name: '27_aware', url: 'https://yt3.ggpht.com/o1bVPFaw8XfE34m1xD6nJN41QLNqgT4Ea9y-uWWRsurgzovFk-lSYYgKWUq1kkIR5_CfhYg0xE8=s128-c-k-nd' },
    { name: '28_maj', url: 'https://yt3.ggpht.com/Ji1xJSuMgrqmz3UWq1Zamcc-W3PcO3t4psuSquUF7qSAMdGqhpPZ2YuQLaoGoTVdzteToEXeSks=s128-c-k-nd' },
    { name: '29_o77', url: 'https://yt3.ggpht.com/_IH9Ud2YUIrU5n3eWh2ssM6DrnpSDNDjyQcg9AgMJywjNbvsjbu5BHZMfBWYlkV0hcioxYtN9A=s128-c-k-nd' },
    { name: '30_ehmm', url: 'https://yt3.ggpht.com/GgcI_iMl3fa6Tx7jXtL2sFD3GoJMG3nM6Vr2iOOus4XjgaFbTohjAf8mBIU4CdSqyJ2CYcaGvA=s128-c-k-nd' },
    { name: '31_cak', url: 'https://yt3.ggpht.com/ERdIwMfmKO6oKbvOgbJxVxJMu6r5NlE5yT3xshFny95_MDaHPeuXN33HRYreH0bpoqhf-VrMqg=s128-c-k-nd' },
    { name: '32_evs', url: 'https://yt3.ggpht.com/7q88V7ihbiRDOfK0NvFGZjezSClCWBHKLvGeEpMpn0tuBOtXl3elg8JfgRJboZnwcuUAoDasbA=s128-c-k-nd' },
    { name: '33_jjjjj', url: 'https://yt3.ggpht.com/2qpCyPkGnNkiZkJZsG2UTXgiyCtUmq8hT_ZUw3TRa00TLol7_pm9_WL2waCMehjTP61Fh4k9z5k=s128-c-k-nd' },
    { name: '34_bonk', url: 'https://yt3.ggpht.com/MJMr-xJdA-t0LTCadNEf8gFKbAli0Klwg4Za6nIm-Uq8z4SIreXN8llpm7cobPdQZr1y4txUXg=s128-c-k-nd' },
    { name: '35_tungsahur', url: 'https://yt3.ggpht.com/ZfkiTj3AY9FgP_YW8YidrIvdsj7Q916Qonj-0iXqRPmfTK3Mmx_ZpupbgQM5MLj7Kz9-sYph8Wg=s128-c-k-nd' },
    { name: '36_ble', url: 'https://yt3.ggpht.com/o7wvLfhlxqknak4aj2G6v6JwaB3LxChw90kIRRs0yTfOvtvjACCifn6DJGi-5BrQf3OGumgnxA=s128-c-k-nd' },
    { name: '37_okaj', url: 'https://yt3.ggpht.com/PFU2wKkG-F-0EO-AHr0O9llJ1GjEt7PkfICBbFDskHvowYlv56nRMlxZ4q7ymybP3jMEng-R=s128-c-k-nd' },
    { name: '38_huhu', url: 'https://yt3.ggpht.com/T8JBbL_B5U5CwA5QYUEO8jyRev_XjBJluDl6Bvuokf3pzBhY1H7H7M4Bw-eOxi00q_8Dvea8=s128-c-k-nd' },
    { name: '39_matcam', url: 'https://yt3.ggpht.com/TYNfA7LrKSW2bRsjEXeQJCPqw-DBFqWccbVZQBOwACqabJ1uytH81M5mvDPaom0QYgYFftFJmQ=s128-c-k-nd' },
    { name: '40_NPC', url: 'https://yt3.ggpht.com/vnYyH5s9NQoBcHoYrriRzD7WXSIXaLESoHiBfRC8UsPn-nYMHIh8908KRp8S8hLms2AxXzhxCQ=s128-c-k-nd' },
    { name: '41_ayaya', url: 'https://yt3.ggpht.com/_rJ33wDxPgvegnAJrgzWCrAhSRoXMXqm8QPnfY8KhYG5hZt45M6WLMuGUghKwEwHA2WEJr0ENA=s128-c-k-nd' },
    { name: '42_real', url: 'https://yt3.ggpht.com/ub1076bOcSDmA7mtki5AS4iqXX4RKNJqWgmTw5lv0jzeBNV9oaCNBWWpkPVe_5UfxiiKUyX01g=s128-c-k-nd' },
    { name: '43_hand-pink-waving', url: 'https://yt3.ggpht.com/KOxdr_z3A5h1Gb7kqnxqOCnbZrBmxI2B_tRQ453BhTWUhYAlpg5ZP8IKEBkcvRoY8grY91Q=s128-c-k-nd' },
    { name: '44_face-blue-smiling', url: 'https://yt3.ggpht.com/cktIaPxFwnrPwn-alHvnvedHLUJwbHi8HCK3AgbHpphrMAW99qw0bDfxuZagSY5ieE9BBrA=s128-c-k-nd' },
    { name: '45_face-red-droopy-eyes', url: 'https://yt3.ggpht.com/oih9s26MOYPWC_uL6tgaeOlXSGBv8MMoDrWzBt-80nEiVSL9nClgnuzUAKqkU9_TWygF6CI=s128-c-k-nd' },
    { name: '46_face-purple-crying', url: 'https://yt3.ggpht.com/g6_km98AfdHbN43gvEuNdZ2I07MmzVpArLwEvNBwwPqpZYzszqhRzU_DXALl11TchX5_xFE=s128-c-k-nd' },
    { name: '47_text-green-game-over', url: 'https://yt3.ggpht.com/cr36FHhSiMAJUSpO9XzjbOgxhtrdJNTVJUlMJeOOfLOFzKleAKT2SEkZwbqihBqfTXYCIg=s128-c-k-nd' },
    { name: '48_person-turqouise-waving', url: 'https://yt3.ggpht.com/uNSzQ2M106OC1L3VGzrOsGNjopboOv-m1bnZKFGuh0DxcceSpYHhYbuyggcgnYyaF3o-AQ=s128-c-k-nd' },
    { name: '49_face-green-smiling', url: 'https://yt3.ggpht.com/G061SAfXg2bmG1ZXbJsJzQJpN8qEf_W3f5cb5nwzBYIV58IpPf6H90lElDl85iti3HgoL3o=s128-c-k-nd' },
    { name: '50_face-orange-frowning', url: 'https://yt3.ggpht.com/Ar8jaEIxzfiyYmB7ejDOHba2kUMdR37MHn_R39mtxqO5CD4aYGvjDFL22DW_Cka6LKzhGDk=s128-c-k-nd' }
];

let count = 0;
emojis.forEach((emoji) => {
    let imgUrl = emoji.url;
    let ext = "png";
    if (imgUrl.includes('.gif')) ext = "gif";
    else if (imgUrl.includes('.jpeg') || imgUrl.includes('.jpg')) ext = "jpg";
    else if (imgUrl.includes('.webp')) ext = "webp";

    const fileName = `${emoji.name}.${ext}`;
    const filePath = path.join(OUT_DIR, fileName);

    https.get(imgUrl, (res) => {
        const fileStream = fs.createWriteStream(filePath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
            fileStream.close();
            count++;
            console.log(`[Browser Agent] Đã tải => ${fileName}`);
            if (count === emojis.length) {
                console.log(`\n✅ Hoàn tất tải ${count} ảnh icon từ trình duyệt phụ vào thư mục YouTube!`);
            }
        });
    }).on('error', (err) => {
        console.error(`❌ Lỗi tải file ${fileName}:`, err.message);
        count++;
    });
});
