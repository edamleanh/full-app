const https = require('https');
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, 'YouTube');

if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR);
}

// Danh sách URL mà subagent đã trích xuất (từ 51-100)
const emojis = [
    { name: '051_eyes-purple-crying', url: 'https://yt3.ggpht.com/FrYgdeZPpvXs-6Mp305ZiimWJ0wV5bcVZctaUy80mnIdwe-P8HRGYAm0OyBtVx8EB9_Dxkc=s128-c-k-nd' },
    { name: '052_face-fuchsia-wide-eyes', url: 'https://yt3.ggpht.com/zdcOC1SMmyXJOAddl9DYeEFN9YYcn5mHemJCdRFQMtDuS0V-IyE-5YjNUL1tduX1zs17tQ=s128-c-k-nd' },
    { name: '053_cat-orange-whistling', url: 'https://yt3.ggpht.com/0ocqEmuhrKCK87_J21lBkvjW70wRGC32-Buwk6TP4352CgcNjL6ug8zcsel6JiPbE58xhq5g=s128-c-k-nd' },
    { name: '054_face-blue-wide-eyes', url: 'https://yt3.ggpht.com/2Ht4KImoWDlCddiDQVuzSJwpEb59nZJ576ckfaMh57oqz2pUkkgVTXV8osqUOgFHZdUISJM=s128-c-k-nd' },
    { name: '055_face-orange-raised-eyebrow', url: 'https://yt3.ggpht.com/JbCfmOgYI-mO17LPw8e_ycqbBGESL8AVP6i7ZsBOVLd3PEpgrfEuJ9rEGpP_unDcqgWSCg=s128-c-k-nd' },
    { name: '056_face-fuchsia-tongue-out', url: 'https://yt3.ggpht.com/EURfJZi_heNulV3mfHzXBk8PIs9XmZ9lOOYi5za6wFMCGrps4i2BJX9j-H2gK6LIhW6h7sY=s128-c-k-nd' },
    { name: '057_face-orange-biting-nails', url: 'https://yt3.ggpht.com/HmsXEgqUogkQOnL5LP_FdPit9Z909RJxby-uYcPxBLNhaPyqPTcGwvGaGPk2hzB_cC0hs_pV=s128-c-k-nd' },
    { name: '058_face-red-heart-shape', url: 'https://yt3.ggpht.com/I0Mem9dU_IZ4a9cQPzR0pUJ8bH-882Eg0sDQjBmPcHA6Oq0uXOZcsjPvPbtormx91Ha2eRA=s128-c-k-nd' },
    { name: '059_face-fuchsia-poop-shape', url: 'https://yt3.ggpht.com/_xlyzvSimqMzhdhODyqUBLXIGA6F_d5en2bq-AIfc6fc3M7tw2jucuXRIo5igcW3g9VVe3A=s128-c-k-nd' },
    { name: '060_face-purple-wide-eyes', url: 'https://yt3.ggpht.com/5RDrtjmzRQKuVYE_FKPUHiGh7TNtX5eSNe6XzcSytMsHirXYKunxpyAsVacTFMg0jmUGhQ=s128-c-k-nd' },
    { name: '061_glasses-purple-yellow-diamond', url: 'https://yt3.ggpht.com/EnDBiuksboKsLkxp_CqMWlTcZtlL77QBkbjz_rLedMSDzrHmy_6k44YWFy2rk4I0LG6K2KI=s128-c-k-nd' },
    { name: '062_face-pink-tears', url: 'https://yt3.ggpht.com/RL5QHCNcO_Mc98SxFEblXZt9FNoh3bIgsjm0Kj8kmeQJWMeTu7JX_NpICJ6KKwKT0oVHhAA=s128-c-k-nd' },
    { name: '063_body-blue-raised-arms', url: 'https://yt3.ggpht.com/2Jds3I9UKOfgjid97b_nlDU4X2t5MgjTof8yseCp7M-6ZhOhRkPGSPfYwmE9HjCibsfA1Uzo=s128-c-k-nd' },
    { name: '064_hand-orange-covering-eyes', url: 'https://yt3.ggpht.com/y8ppa6GcJoRUdw7GwmjDmTAnSkeIkUptZMVQuFmFaTlF_CVIL7YP7hH7hd0TJbd8p9w67IM=s128-c-k-nd' },
    { name: '065_trophy-yellow-smiling', url: 'https://yt3.ggpht.com/7tf3A_D48gBg9g2N0Rm6HWs2aqzshHU4CuVubTXVxh1BP7YDBRC6pLBoC-ibvr-zCl_Lgg=s128-c-k-nd' },
    { name: '066_eyes-pink-heart-shape', url: 'https://yt3.ggpht.com/5vzlCQfQQdzsG7nlQzD8eNjtyLlnATwFwGvrMpC8dgLcosNhWLXu8NN9qIS3HZjJYd872dM=s128-c-k-nd' },
    { name: '067_face-turquoise-covering-eyes', url: 'https://yt3.ggpht.com/H2HNPRO8f4SjMmPNh5fl10okSETW7dLTZtuE4jh9D6pSmaUiLfoZJ2oiY-qWU3Owfm1IsXg=s128-c-k-nd' },
    { name: '068_hand-green-crystal-ball', url: 'https://yt3.ggpht.com/qZfJrWDEmR03FIak7PMNRNpMjNsCnOzD9PqK8mOpAp4Kacn_uXRNJNb99tE_1uyEbvgJReF2=s128-c-k-nd' },
    { name: '069_face-turquoise-drinking-coffee', url: 'https://yt3.ggpht.com/myqoI1MgFUXQr5fuWTC9mz0BCfgf3F8GSDp06o1G7w6pTz48lwARjdG8vj0vMxADvbwA1dA=s128-c-k-nd' },
    { name: '070_body-green-covering-eyes', url: 'https://yt3.ggpht.com/UR8ydcU3gz360bzDsprB6d1klFSQyVzgn-Fkgu13dIKPj3iS8OtG1bhBUXPdj9pMwtM00ro=s128-c-k-nd' },
    { name: '071_goat-turquoise-white-horns', url: 'https://yt3.ggpht.com/jMnX4lu5GnjBRgiPtX5FwFmEyKTlWFrr5voz-Auko35oP0t3-zhPxR3PQMYa-7KhDeDtrv4=s128-c-k-nd' },
    { name: '072_hand-purple-blue-peace', url: 'https://yt3.ggpht.com/-sC8wj6pThd7FNdslEoJlG4nB9SIbrJG3CRGh7-bNV0RVfcrJuwiWHoUZ6UmcVs7sQjxTg4=s128-c-k-nd' },
    { name: '073_face-blue-question-mark', url: 'https://yt3.ggpht.com/Wx4PMqTwG3f4gtR7J9Go1s8uozzByGWLSXHzrh3166ixaYRinkH_F05lslfsRUsKRvHXrDk=s128-c-k-nd' },
    { name: '074_face-blue-covering-eyes', url: 'https://yt3.ggpht.com/kj3IgbbR6u-mifDkBNWVcdOXC-ut-tiFbDpBMGVeW79c2c54n5vI-HNYCOC6XZ9Bzgupc10=s128-c-k-nd' },
    { name: '075_face-purple-smiling-fangs', url: 'https://yt3.ggpht.com/k1vqi6xoHakGUfa0XuZYWHOv035807ARP-ZLwFmA-_NxENJMxsisb-kUgkSr96fj5baBOZE=s128-c-k-nd' },
    { name: '076_face-purple-sweating', url: 'https://yt3.ggpht.com/tRnrCQtEKlTM9YLPo0vaxq9mDvlT0mhDld2KI7e_nDRbhta3ULKSoPVHZ1-bNlzQRANmH90=s128-c-k-nd' },
    { name: '077_face-purple-smiling-tears', url: 'https://yt3.ggpht.com/MJV1k3J5s0hcUfuo78Y6MKi-apDY5NVDjO9Q7hL8fU4i0cIBgU-cU4rq4sHessJuvuGpDOjJ=s128-c-k-nd' },
    { name: '078_face-blue-star-eyes', url: 'https://yt3.ggpht.com/m_ANavMhp6cQ1HzX0HCTgp_er_yO2UA28JPbi-0HElQgnQ4_q5RUhgwueTpH-st8L3MyTA=s128-c-k-nd' },
    { name: '079_face-blue-heart-eyes', url: 'https://yt3.ggpht.com/M9tzKd64_r3hvgpTSgca7K3eBlGuyiqdzzhYPp7ullFAHMgeFoNLA0uQ1dGxj3fXgfcHW4w=s128-c-k-nd' },
    { name: '080_face-blue-three-eyes', url: 'https://yt3.ggpht.com/nSQHitVplLe5uZC404dyAwv1f58S3PN-U_799fvFzq-6b3bv-MwENO-Zs1qQI4oEXCbOJg=s128-c-k-nd' },
    { name: '081_face-blue-droopy-eyes', url: 'https://yt3.ggpht.com/hGPqMUCiXGt6zuX4dHy0HRZtQ-vZmOY8FM7NOHrJTta3UEJksBKjOcoE6ZUAW9sz7gIF_nk=s128-c-k-nd' },
    { name: '082_planet-orange-purple-ring', url: 'https://yt3.ggpht.com/xkaLigm3P4_1g4X1JOtkymcC7snuJu_C5YwIFAyQlAXK093X0IUjaSTinMTLKeRZ6280jXg=s128-c-k-nd' },
    { name: '083_face-turquoise-speaker-shape', url: 'https://yt3.ggpht.com/WTFFqm70DuMxSC6ezQ5Zs45GaWD85Xwrd9Sullxt54vErPUKb_o0NJQ4kna5m7rvjbRMgr3A=s128-c-k-nd' },
    { name: '084_octopus-red-waving', url: 'https://yt3.ggpht.com/L9Wo5tLT_lRQX36iZO_fJqLJR4U74J77tJ6Dg-QmPmSC_zhVQ-NodMRc9T0ozwvRXRaT43o=s128-c-k-nd' },
    { name: '085_pillow-turquoise-hot-chocolate', url: 'https://yt3.ggpht.com/cAR4cehRxbn6dPbxKIb-7ShDdWnMxbaBqy2CXzBW4aRL3IqXs3rxG0UdS7IU71OEU7LSd20q=s128-c-k-nd' },
    { name: '086_hourglass-purple-sand-orange', url: 'https://yt3.ggpht.com/MFDLjasPt5cuSM_tK5Fnjaz_k08lKHdX_Mf7JkI6awaHriC3rGL7J_wHxyG6PPhJ8CJ6vsQ=s128-c-k-nd' },
    { name: '087_fish-orange-wide-eyes', url: 'https://yt3.ggpht.com/iQLKgKs7qL3091VHgVgpaezc62uPewy50G_DoI0dMtVGmQEX5pflZrUxWfYGmRfzfUOOgJs=s128-c-k-nd' },
    { name: '088_popcorn-yellow-striped-smile', url: 'https://yt3.ggpht.com/TW_GktV5uVYviPDtkCRCKRDrGlUc3sJ5OHO81uqdMaaHrIQ5-sXXwJfDI3FKPyv4xtGpOlg=s128-c-k-nd' },
    { name: '089_penguin-blue-waving-tear', url: 'https://yt3.ggpht.com/p2u7dcfZau4_bMOMtN7Ma8mjHX_43jOjDwITf4U9adT44I-y-PT7ddwPKkfbW6Wx02BTpNoC=s128-c-k-nd' },
    { name: '090_clock-turquoise-looking-up', url: 'https://yt3.ggpht.com/tDnDkDZykkJTrsWEJPlRF30rmbek2wcDcAIymruOvSLTsUFIZHoAiYTRe9OtO-80lDfFGvo=s128-c-k-nd' },
    { name: '091_face-red-smiling-live', url: 'https://yt3.ggpht.com/14Pb--7rVcqnHvM7UlrYnV9Rm4J-uojX1B1kiXYvv1my-eyu77pIoPR5sH28-eNIFyLaQHs=s128-c-k-nd' },
    { name: '092_hands-yellow-heart-red', url: 'https://yt3.ggpht.com/qWSu2zrgOKLKgt_E-XUP9e30aydT5aF3TnNjvfBL55cTu1clP8Eoh5exN3NDPEVPYmasmoA=s128-c-k-nd' },
    { name: '093_volcano-green-lava-orange', url: 'https://yt3.ggpht.com/_IWOdMxapt6IBY5Cb6LFVkA3J77dGQ7P2fuvYYv1-ahigpVfBvkubOuGLSCyFJ7jvis-X8I=s128-c-k-nd' },
    { name: '094_person-turquoise-waving-speech', url: 'https://yt3.ggpht.com/gafhCE49PH_9q-PuigZaDdU6zOKD6grfwEh1MM7fYVs7smAS_yhYCBipq8gEiW73E0apKTzi=s128-c-k-nd' },
    { name: '095_face-orange-tv-shape', url: 'https://yt3.ggpht.com/EVK0ik6dL5mngojX9I9Juw4iFh053emP0wcUjZH0whC_LabPq-DZxN4Jg-tpMcEVfJ0QpcJ4=s128-c-k-nd' },
    { name: '096_face-blue-spam-shape', url: 'https://yt3.ggpht.com/hpwvR5UgJtf0bGkUf8Rn-jTlD6DYZ8FPOFY7rhZZL-JHj_7OPDr7XUOesilRPxlf-aW42Zg=s128-c-k-nd' },
    { name: '097_face-fuchsia-flower-shape', url: 'https://yt3.ggpht.com/o9kq4LQ0fE_x8yxj29ZeLFZiUFpHpL_k2OivHbjZbttzgQytU49Y8-VRhkOP18jgH1dQNSVz=s128-c-k-nd' },
    { name: '098_person-blue-holding-pencil', url: 'https://yt3.ggpht.com/TKgph5IHIHL-A3fgkrGzmiNXzxJkibB4QWRcf_kcjIofhwcUK_pWGUFC4xPXoimmne3h8eQ=s128-c-k-nd' },
    { name: '099_body-turquoise-yoga-pose', url: 'https://yt3.ggpht.com/GW3otW7CmWpuayb7Ddo0ux5c-OvmPZ2K3vaytJi8bHFjcn-ulT8vcHMNcqVqMp1j2lit2Vw=s128-c-k-nd' },
    { name: '100_location-yellow-teal-bars', url: 'https://yt3.ggpht.com/YgeWJsRspSlAp3BIS5HMmwtpWtMi8DqLg9fH7DwUZaf5kG4yABfE1mObAvjCh0xKX_HoIR23=s128-c-k-nd' }
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
                console.log(`\n✅ Hoàn tất tải ${count} ảnh icon (từ 51-100) từ trình duyệt phụ vào thư mục YouTube!`);
            }
        });
    }).on('error', (err) => {
        console.error(`❌ Lỗi tải file ${fileName}:`, err.message);
        count++;
    });
});
