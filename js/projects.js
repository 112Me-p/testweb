/* Only insert projects that FACEWALL owns/has permission to publish.
Required: id, title, category (wallpaper/flooring), products, location,
image (hero photo), description, date (optional). A review must have consent.
EXAMPLE STRUCTURE (NOT ACTIVE):
{ id: "project-001", title: "ชื่อโครงการ", category: "wallpaper", products: "ชื่อรุ่น",
 location: "กรุงเทพฯ", image: "assets/projects/001.jpg", description: "งานที่ทำ",
 review: { quote: "ข้อความรีวิวจริง", attribution: "ลูกค้ายินยอมให้ลงชื่อ" } }
*/
window.FACEWALL_REAL_PROJECTS = [];
