# FACEWALL · Draft 04 / GitHub Pages

เวอร์ชันทดลอง Static HTML/CSS/JavaScript สำหรับอัปโหลด **ทับ repository เดิม** (ไม่ใช่ WordPress theme)

## ติดตั้ง

1. แตกไฟล์ ZIP แล้วอัปโหลด **เนื้อหาภายในทั้งหมด** ไปยัง root ของ repository เดิม โดยให้ `index.html` อยู่ที่ root
2. เขียนทับไฟล์เดิมทั้งหมด (โดยเฉพาะ `css/`, `js/`, `assets/`) แล้ว commit
3. GitHub Settings → Pages → Deploy from branch → main → / (root)
4. รีเฟรชแบบไม่ใช้ cache บนมือถือถ้ายังเห็นเวอร์ชันเก่า

## Draft 04 changes

- Wallpaper 10 เล่ม: Andante, No.5, Square Garden, Texture II, SOHO Premium, Savoy, Promise, Mega, Kara, Desian (**ยกเลิก NO.7**)
- Flooring 6 เล่ม: SPC Click 4.0 / 5.5 / 6.5 / 9.0 mm, LVT Glue 2.0 / 3.0 mm
- ปกหนังสือทุกเล่มเป็น WebP โปร่งใสจากภาพที่ผู้ใช้ส่งมา พร้อม Minimal Overlay และการกรอง/ค้นหา
- Wallpaper เปิดลิงก์ PDF โดยตรงที่ DECCO; Flooring เปิด FlipHTML5 ตามรุ่น/ความหนา
- แก้ทุก directional arrow เป็น SVG แบบเดียวกันบน Desktop และ Mobile รวม Compare Slider
- เปลี่ยนภาพปก Blog เรื่อง Wallpaper Printing และ Repair โดยใช้ภาพที่ผู้ใช้ส่ง
- คง Home / Before & After / Blog / Contact และ CI ตาม Draft 03

## Site Map

- `index.html` Home
- `showcase.html` Before/After
- `catalog.html` eCatalog
- `blog.html` Journal
- `contact.html` Contact
- `blog-wallpaper-vs-paint.html`, `blog-printing-wallpaper.html`, `blog-repair-wallpaper.html`

## Notes

- ไม่มี database สินค้าราย SKU ใช้ `js/catalogs.js` สำหรับข้อมูลเล่มเท่านั้น
- ก่อน/หลัง เป็นภาพตัวอย่างสาธิต; ไม่กล่าวอ้างว่าเป็นผลงานจริงของแบรนด์
- LINE @proface เป็นบัญชีติดต่อชั่วคราว, Facebook ยังไม่มี URL จริง
- Meta noindex เป็นค่าของเว็บไซต์ต้นแบบ; ก่อน WordPress production ควรวางแผน SEO, URL, canonical, post taxonomy ใหม่
- ลิงก์ eCatalog เป็น URL ของบุคคลภายนอก เว็บไซต์ต้นทางอาจเปลี่ยนการเข้าถึงในอนาคต
