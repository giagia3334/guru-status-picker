/* Selected OPUS Batumi guest reviews, transcribed from 32 user-provided Booking.com screenshots.
 * Source: https://www.booking.com/hotel/ge/opus-batumi.en-gb.html
 * Original review wording, guest names, nationalities and scores are retained where visible.
 * Marquee runs opposite to the Google reviews carousel and honors reduced motion.
 */
(() => {
  'use strict';
  const root = document.getElementById('booking-reviews');
  const viewport = document.getElementById('booking-reviews-window');
  const track = document.getElementById('booking-reviews-track');
  if (!root || !viewport || !track) return;

  const observations = [
  {
    "author": "Mohammad",
    "origin": "Israel",
    "flag": "🇮🇱",
    "score": "10",
    "text": "Very nice place all clean and very modern i thought pictures were not real but it was super nice and good quality",
    "avatar": null,
    "sourceScreenshot": "Screenshot 2026-11-10 at 23.38.54.png"
  },
  {
    "author": "Max",
    "origin": "Ukraine",
    "flag": "🇺🇦",
    "score": "10",
    "text": "The hotel is very clean, brand new, and well-maintained. The entire staff does an impeccable job, and the level of service is exceptionally high. I would especially like to note the work of the Russian-speaking porter and the receptionist girl, who were always helpful with any of our requests and needs. Thank you, it was a wonderful stay!",
    "avatar": "booking-23-40-00.webp",
    "sourceScreenshot": "Screenshot 2026-11-10 at 23.40.00.png"
  },
  {
    "author": "Abdulmonem",
    "origin": "Saudi Arabia",
    "flag": "🇸🇦",
    "score": "10",
    "text": "Cleanliness and a peaceful sea view.\n\nBreakfast is not provided.",
    "avatar": null,
    "sourceScreenshot": "Screenshot 2026-11-10 at 23.40.32.png"
  },
  {
    "author": "Karim",
    "origin": "France",
    "flag": "🇫🇷",
    "score": "10",
    "text": "It was by far the best hotel we went to in Georgia. We can't wait to come back, hopefully next year! Thank you again for",
    "avatar": null,
    "sourceScreenshot": "Screenshot 2026-11-10 at 23.41.05.png"
  },
  {
    "author": "Mikadze",
    "origin": "Georgia",
    "flag": "🇬🇪",
    "score": "10",
    "text": "The property has a beautiful modern design, spacious rooms, and an amazing sea view. The location is excellent, and the apartment was very comfortable and well equipped. We also really enjoyed the peaceful atmosphere and the overall quality of the stay.",
    "avatar": null,
    "sourceScreenshot": "Screenshot 2026-11-10 at 23.41.55.png"
  },
  {
    "author": "Luigi",
    "origin": "Bulgaria",
    "flag": "🇧🇬",
    "score": "10",
    "text": "Very comfortable and new modern hotel meeting european standards",
    "avatar": null,
    "sourceScreenshot": "Screenshot 2026-11-10 at 23.42.36.png"
  },
  {
    "author": "Yosef",
    "origin": "Israel",
    "flag": "🇮🇱",
    "score": "10",
    "text": "Excellent hotel. New and clean. 8-minute car ride from the airport. Above all, extremely kind staff—the genuine desire to help shines through in every interaction. Made the stay in Batumi very pleasant.\n\nמלון מעולה. חדש ונקי. 8 דקות נסיעה משדה התעופה. יותר מכל, צוות אדיב בצורה יוצאת דופן – הרצון האמיתי לסייע מורגש היטב בכל אינטראקציה. השהות כאן הנעימה מאוד את החופשה בבטומי.",
    "avatar": null,
    "sourceScreenshot": "Screenshot 2026-11-10 at 23.42.57.png"
  },
  {
    "author": "Alina",
    "origin": "United Arab Emirates",
    "flag": "🇦🇪",
    "score": "10",
    "text": "The hotel is just amazing, very clean, everything is available, kitchen and washing machine was very useful during our stay. No queue for elevators. Location is great and pool was also clean and sun-beds were always available. But the most amazing is the stuff! Very helpful and attentive, super polite and we’re ready to assist at any time of the day!\n\nNothing",
    "avatar": "booking-23-43-46.webp",
    "sourceScreenshot": "Screenshot 2026-11-10 at 23.43.46.png"
  },
  {
    "author": "Daniel",
    "origin": "Israel",
    "flag": "🇮🇱",
    "score": "10",
    "text": "Everything was great the location the rooms all the facilities very comfortable it very nice everything is new there\nThere is a washing machine combined with a dryer\nThe rooms are large",
    "avatar": null,
    "sourceScreenshot": "Screenshot 2026-11-10 at 23.44.16.png"
  },
  {
    "author": "Ido",
    "origin": "Israel",
    "flag": "🇮🇱",
    "score": "10",
    "text": "Amazing stay and incredible staff!\nWe stayed here as a family of six at the start of our trip and loved it so much that we booked another two nights at the end of our vacation. That turned out to be the best decision we made. The rooms are spotless, super comfortable, and truly high-end.",
    "avatar": null,
    "sourceScreenshot": "Screenshot 2026-11-10 at 23.44.47.png"
  },
  {
    "author": "Deeksha",
    "origin": "United Kingdom",
    "flag": "🇬🇧",
    "score": "9.0",
    "text": "Location, the apartment, facilities",
    "avatar": null,
    "sourceScreenshot": "Screenshot 2026-11-10 at 23.45.52.png"
  },
  {
    "author": "Dea",
    "origin": "Georgia",
    "flag": "🇬🇪",
    "score": "10",
    "text": "I had a fantastic experience and was honestly surprised by the level of comfort here. The room was sparkling clean and everything felt so fresh and well-maintained. What I loved most was the fully equipped kitchen—it’s not just a kitchenette, but a proper setup with everything you need to cook a real meal. It was so nice to be able to prepare my own breakfast and dinner whenever I felt like staying in. If you’re looking for a place that combines the luxury of a hotel with the independence of a home, this is it. Will definitely be back!",
    "avatar": "booking-23-47-11.webp",
    "sourceScreenshot": "Screenshot 2026-11-10 at 23.47.11.png"
  },
  {
    "author": "Artem",
    "origin": "Georgia",
    "flag": "🇬🇪",
    "score": "10",
    "text": "We had a wonderful stay! The views from the hotel are absolutely stunning—you can see the sea, the city, and the mountains all at once. What made it even better was the staff; they are so friendly and welcoming that you feel right at home(a special thanks to the bellboy Giorgi). Highly recommended!",
    "avatar": null,
    "sourceScreenshot": "Screenshot 2026-11-10 at 23.47.29.png"
  },
  {
    "author": "Bolkvadze",
    "origin": "Georgia",
    "flag": "🇬🇪",
    "score": "9.0",
    "text": "ნამდვილად კარგი გარემო დამხვდა, სუფთა და მოწესრიგებული, ახლოს სანაპიროსთან და მაღაზიებთან, აუცილებლად დავბრუნდები როგორც კი შანსი მომეცემა ❤️✨",
    "avatar": "booking-23-47-47.webp",
    "sourceScreenshot": "Screenshot 2026-11-10 at 23.47.47.png"
  },
  {
    "author": "Tamar",
    "origin": "Spain",
    "flag": "🇪🇸",
    "score": "10",
    "text": "An exceptional experience! The hotel combines sophisticated design with ultimate comfort, making it the perfect getaway. Every detail reflects high quality and style. The staff is incredibly professional and welcoming—special thanks to Mariam, whose exceptional hospitality and kindness stood out. She truly made our stay unforgettable. Looking forward to visiting again!",
    "avatar": "booking-23-48-09.webp",
    "sourceScreenshot": "Screenshot 2026-11-10 at 23.48.09.png"
  },
  {
    "author": "Shantadze",
    "origin": "Georgia",
    "flag": "🇬🇪",
    "score": "10",
    "text": "შესანიშნავი ლოკაცია, სუფთა და კომფორტული ოთახი, აუცილებლად დავბრუნდებით",
    "avatar": "booking-23-48-29.webp",
    "sourceScreenshot": "Screenshot 2026-11-10 at 23.48.29.png"
  },
  {
    "author": "Alexander",
    "origin": "Germany",
    "flag": "🇩🇪",
    "score": "10",
    "text": "Sehr schönes, modernes und neues Hotel! Alles ist sauber und gepflegt, die Mitarbeiter sind sehr freundlich und hilfsbereit. Auch die Lage ist super, da der Strand nicht weit entfernt ist. Wir haben uns sehr wohlgefühlt und kommen gerne wieder. Absolut empfehlenswert!",
    "avatar": null,
    "sourceScreenshot": "Screenshot 2026-11-10 at 23.50.02.png"
  },
  {
    "author": "Abdulaziz",
    "origin": "Qatar",
    "flag": "🇶🇦",
    "score": "10",
    "text": "يوجد كل ما تحتاج به وهذا امر رائع\n\nلا يوجد شيء، لم يعجبني كل شيء استثنائي بكل ما تعنيه الكلمة",
    "avatar": null,
    "sourceScreenshot": "Screenshot 2026-11-10 at 23.50.32.png"
  },
  {
    "author": "Maayan",
    "origin": "Israel",
    "flag": "🇮🇱",
    "score": "10",
    "text": "Calisanlar cok guler yuzlu ve otel cok temiz ve hersey mukemmeldi konum olarak ta cok iyiydi sadece kahvalti olsaydi cok daha guzel olurdu tekrar gidersem yine ayni oteli tercih ederim",
    "avatar": null,
    "sourceScreenshot": "Screenshot 2026-11-10 at 23.50.53.png"
  },
  {
    "author": "Snir",
    "origin": "Israel",
    "flag": "🇮🇱",
    "score": "10",
    "text": "החדרים חדשים נקיים ומרווחים מאוד , המטבח מאובזר מאוד .\nבגקוזי מים כל יום היה בחדר , ניקיון טוב מאוד. הצוות היה מקסים ענה תמיד בשירות הוואטאפ לבקשתנו.\nממליץ מאוד.",
    "avatar": "booking-23-51-14.webp",
    "sourceScreenshot": "Screenshot 2026-11-10 at 23.51.14.png"
  },
  {
    "author": "Alejandro",
    "origin": "Spain",
    "flag": "🇪🇸",
    "score": "10",
    "text": "Habitacion comoda con mobiliario moderno y minicocina",
    "avatar": null,
    "sourceScreenshot": "Screenshot 2026-11-10 at 23.51.42.png"
  },
  {
    "author": "גלפנד",
    "origin": "Israel",
    "flag": "🇮🇱",
    "score": "10",
    "text": "מלון מצוין, חדר נקי מאד, מאובזר ברמה גבוהה מאד, אפילו המטבח כמו בבית! דאגו עד הפרטים הקטנים כמו מברשת שיניים. מיטות נוחות, חדר מרווח מאד. המיקום נוח מאד, הצוות אדיב מאד, איפשרו צק אין מוקדם מהרגיל. מהתחלה קיבלנו חדר עם נוף לאתר בניה (אין מה לעשות בונים פה ממש על כל מטר פנוי), אבל הצוות תמורה . opus ענה לבקשה שלנו לעבור חדר וקיבלנו חדר אחר תוך זמן קצר. אני מאד מרוצה ובהחלט ממליצה על הרמה יותר גבוה ביחס למחיר ששילמתי. בשמחה רבה נחזור לשם שוב.",
    "avatar": null,
    "sourceScreenshot": "Screenshot 2026-11-10 at 23.52.21.png"
  },
  {
    "author": "Ifat",
    "origin": "Israel",
    "flag": "🇮🇱",
    "score": "10",
    "text": "מקום מושלם\nהכל חדש ונקי מאד\nכל המתקנים ברמה גבוהה יש מטבח נוח ומאובזר והמיקום ליד הים וקרוב לעיר",
    "avatar": null,
    "sourceScreenshot": "Screenshot 2026-11-10 at 23.52.42.png"
  },
  {
    "author": "Judith",
    "origin": "Germany",
    "flag": "🇩🇪",
    "score": "10",
    "text": "Einer der besten Aufenthalte die wir je hatten. Das Hotel ist brandneu und sehr geschmackvoll ausgestattet. Das Zimmer ist geräumig, verfügt über eine Küchenzeile und das Bad ist traumhaft. Ich würde auf jeden Fall wieder hier übernachten.",
    "avatar": null,
    "sourceScreenshot": "Screenshot 2026-11-10 at 23.53.15.png"
  },
  {
    "author": "Юлия",
    "origin": "Russia",
    "flag": "🇷🇺",
    "score": "10",
    "text": "Однозначно рекомендую, персонал приветливый, если чего то не хватает то исправляют и приносят. Вид с балкона невероятный",
    "avatar": "booking-23-53-33.webp",
    "sourceScreenshot": "Screenshot 2026-11-10 at 23.53.33.png"
  },
  {
    "author": "Delphine",
    "origin": "Belgium",
    "flag": "🇧🇪",
    "score": "9.0",
    "text": "Tout\n\nRien",
    "avatar": "booking-23-54-17.webp",
    "sourceScreenshot": "Screenshot 2026-11-10 at 23.54.17.png"
  },
  {
    "author": "Yihe",
    "origin": "China",
    "flag": "🇨🇳",
    "score": "10",
    "text": "服务特别好 三个人还帮我们加了沙发床 打不到车前台还帮助我们叫车 房间也特别干净 还有洗衣机\n\n无",
    "avatar": null,
    "sourceScreenshot": "Screenshot 2026-11-10 at 23.55.05.png"
  },
  {
    "author": "Mathilde",
    "origin": "France",
    "flag": "🇫🇷",
    "score": "10",
    "text": "Nous avons aimé le confort de la literie, les équipements de la chambre et la piscine, c’était très sympa 😊",
    "avatar": "booking-23-55-21.webp",
    "sourceScreenshot": "Screenshot 2026-11-10 at 23.55.21.png"
  },
  {
    "author": "Gazy",
    "origin": "Netherlands",
    "flag": "🇳🇱",
    "score": "10",
    "text": "Het appartement was superschoon, modern ingericht en comfortabel. Het personeel was erg vriendelijk en behulpzaam.",
    "avatar": null,
    "sourceScreenshot": "Screenshot 2026-11-10 at 23.56.03.png"
  },
  {
    "author": "Yitian",
    "origin": "China",
    "flag": "🇨🇳",
    "score": "10",
    "text": "设施特别好，有冰箱、洗衣机（可以烘干衣服）、小厨房、各种餐具，可以自己做饭。卫生巾和玻璃的隔音效果好，毛巾特别柔软。阳台也特别大，可以看到海的一角。酒店人员服务态度不错。前台vakho帮我们保管了行李并提醒。",
    "avatar": null,
    "sourceScreenshot": "Screenshot 2026-11-10 at 23.56.22.png"
  }
];
  const source = 'https://www.booking.com/hotel/ge/opus-batumi.en-gb.html';
  const createCard = item => {
    const card = document.createElement('article');
    card.className = 'guest-review-card booking-review-card';
    const top = document.createElement('div');
    top.className = 'guest-review-card-top';
    const quote = document.createElement('span');
    quote.className = 'guest-review-quote';
    quote.setAttribute('aria-hidden','true');
    quote.textContent = '“';
    const platform = document.createElement('span');
    platform.className = 'booking-review-platform';
    platform.textContent = 'Booking.com';
    top.append(quote,platform);
    const copy = document.createElement('p');
    copy.className = 'guest-review-text';
    copy.textContent = item.text;
    copy.title = item.text;
    copy.lang = /[֐-׿]/.test(item.text) ? 'he' : /[؀-ۿ]/.test(item.text) ? 'ar' : /[一-鿿]/.test(item.text) ? 'zh' : 'auto';
    const person = document.createElement('div');
    person.className = 'guest-review-person';
    const avatar = document.createElement('span');
    avatar.className = 'guest-review-avatar booking-review-avatar';
    if (item.avatar) {
      const img = document.createElement('img');
      img.src = item.avatar;
      img.alt = '';
      img.loading = 'lazy';
      avatar.append(img);
    } else { avatar.textContent = item.author.charAt(0); }
    const details = document.createElement('span');
    const name = document.createElement('strong');
    name.textContent = item.author;
    const caption = document.createElement('small');
    caption.className = 'booking-review-origin';
    const flag = document.createElement('span');
    flag.className = 'booking-review-flag';
    flag.textContent = item.flag || '';
    flag.setAttribute('aria-hidden', 'true');
    const captionText = document.createElement('span');
    captionText.textContent = `Guest from ${item.origin}`;
    caption.append(captionText, flag);
    details.append(name,caption);
    person.append(avatar,details);

    const footer = document.createElement('div');
    footer.className = 'booking-review-footer';
    footer.append(person);

    const score = document.createElement('div');
    score.className = 'booking-review-score';
    score.setAttribute('aria-label', `Guest rating ${item.score} out of 10`);
    score.textContent = item.score;
    footer.append(score);

    card.append(top,copy,footer);
    return card;
  };

  const cards = observations.map(createCard);
  const rendered = [];
  for (let round = 0; round < 3; round++) {
    cards.forEach(card => {
      const copy = card.cloneNode(true);
      rendered.push(copy);
      track.append(copy);
    });
  }
  let offset = 0;
  let width = 0;
  let last = 0;
  let raf = 0;
  let pointerDown = false;
  let inView = false;
  const SPEED = 42;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const wrap = () => {
    if (!width) return;
    while (offset < width) offset += width;
    while (offset >= width * 2) offset -= width;
  };
  const draw = () => {
    track.style.transform = `translate3d(${-offset}px,0,0)`;
    const cardWidth = rendered[0].offsetWidth;
    const focusRange = cardWidth * 1.45 + 24;
    let best = null;
    let shortest = Infinity;
    for (const card of rendered) {
      const distance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - offset);
      const strength = Math.max(0, 1 - distance / focusRange);
      card.style.opacity = (0.30 + strength * 0.70).toFixed(3);
      card.style.transform = `scale(${(0.955 + 0.045 * strength).toFixed(4)})`;
      if (distance < shortest) { shortest = distance; best = card; }
    }
    for (const card of rendered) {
      const active = card === best;
      card.classList.toggle('is-current', active);
      card.setAttribute('aria-hidden', active ? 'false' : 'true');
    }
  };
  const measure = initial => {
    const nextWidth = rendered[cards.length].offsetLeft - rendered[0].offsetLeft;
    if (nextWidth <= 0) return;
    const oldWidth = width;
    const fraction = oldWidth ? (offset - oldWidth) / oldWidth : 0;
    width = nextWidth;
    offset = initial ? rendered[cards.length + 2].offsetLeft + rendered[cards.length + 2].offsetWidth / 2 : width * (1 + fraction);
    wrap(); draw();
  };
  const tick = time => {
    if (!last) last = time;
    const delta = Math.min((time - last)/1000, .06);
    last = time;
    if (!pointerDown && !document.hidden && inView && !reducedMotion.matches) {
      // Increasing offset moves the continuous loop RIGHT-to-LEFT.
      offset += SPEED * delta;
      wrap(); draw();
    }
    raf = requestAnimationFrame(tick);
  };
  const observer = new IntersectionObserver(entries => {
    inView = Boolean(entries[0]?.isIntersecting);
    last = 0;
  }, { threshold: 0.05 });
  observer.observe(viewport);
  bindReviewGestures(viewport, {
    canMove: () => width > 0,
    onStart: () => { pointerDown = true; },
    onMove: delta => { offset += delta; wrap(); draw(); },
    onEnd: () => { pointerDown = false; last = 0; }
  });
  window.addEventListener('resize', () => measure(false), {passive:true});
  reducedMotion.addEventListener?.('change', () => { last = 0; });
  requestAnimationFrame(() => { measure(true); raf = requestAnimationFrame(tick); });
})();
