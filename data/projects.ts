export type ProjectMeta = {
  service: string
  date: string
  industry: string
}

export type Project = {
  id: string
  brand: string
  meta: ProjectMeta
  description: string
  descriptionEn?: string
  assets: {
    header: string
    attached: string[]
    gallery: string[]
  }
}

const projects: Project[] = [
  {
    id: "p1",
    brand: "GROOVY",
    meta: {
      service: "品牌全案设计",
      date: "",
      industry: "家居行业",
    },
    description:
      'GROOVY是一个以孟菲斯风格为基调的家居集合品牌，以"打破常规、玩转生活"为核心理念，通过大胆的色彩碰撞、趣味化设计和环保主张，重新定义年轻群体的家居美学。设计上我们放弃工业设计的完美线条，以粗线条剪影勾勒家居形态，保留手绘草稿的原始质感，传递品牌的轻松趣味。色彩上我们大胆采用高饱和主色形成非和谐配色方案，强化视觉记忆点。全线包装采用再生牛皮纸，通过裸色基底与品牌色彩对比，平衡自然感与潮流感。',
    descriptionEn:
      'GROOVY is a home collection brand rooted in Memphis-style design, with the core concept of "breaking conventions and playing with life." Through bold color clashes, playful design, and an eco-conscious stance, the brand redefines home aesthetics for younger generations. In design, we abandon the perfect lines of industrial design, using thick-line silhouettes to outline furniture forms while preserving the raw texture of hand-drawn sketches, conveying the brand\'s relaxed playfulness. For color, we boldly employ high-saturation primary colors to create non-harmonious color schemes, strengthening visual memory. The entire packaging line uses recycled kraft paper, balancing natural feel with trendiness through the contrast between the bare base and brand colors.',
    assets: {
      header: "/projects/p1/header.png",
      attached: [],
      gallery: [
        "/projects/p1/p1-02.png",
        "/projects/p1/p1-03.png",
        "/projects/p1/p1-04.png",
        "/projects/p1/p1-05.png",
        "/projects/p1/p1-06.png",
        "/projects/p1/p1-07.png",
        "/projects/p1/p1-08.png",
        "/projects/p1/p1-09.png",
        "/projects/p1/p1-10.png",
        "/projects/p1/p1-11.png",
      ],
    },
  },
  {
    id: "p3",
    brand: "Eden's Fork",
    meta: {
      service: "品牌全案设计",
      date: "",
      industry: "餐饮行业",
    },
    description:
      "Eden's Fork是一家以趣味现代的西餐厅品牌，以\"每一次用餐都是一次选择与探索的旅程\"为核心理念，我们通过大胆的法式餐厅经典配色、趣味化IP设计和现代创意表达，打造适合年轻群体的餐饮美学体验。设计上我们围绕\"现代创意\"与\"手作温度\"的碰撞展开，营造亲切、灵动、富有想象力的艺术化就餐氛围，邀请顾客暂时脱离日常，踏入这个色彩与美味交织的岔路口故事。可爱的企鹅IP化身餐厅的明星侍者与灵魂向导，姿态优雅动作专业，充满拟人化的俏皮与故事性，我们希望构建一个独特且充满感染力的西餐厅品牌，传达\"在每一次美味的岔路口，遇见艺术与惊喜\"的餐厅核心体验。",
    descriptionEn:
      "Eden's Fork is a playful and modern Western restaurant brand, with the core concept that \"every meal is a journey of choice and exploration.\" Through bold French restaurant classic color schemes, playful IP design, and modern creative expression, we craft a dining aesthetic experience suited for younger groups. Our design revolves around the collision of \"modern creativity\" and \"handcrafted warmth,\" creating an intimate, lively, and imaginative artistic dining atmosphere that invites customers to step away from the everyday and enter a story of colors and flavors intersecting at a fork in the road. The adorable penguin IP becomes the restaurant's star waiter and soul guide—elegant in posture, professional in action, full of personified playfulness and storytelling. We aim to build a unique and compelling Western restaurant brand, conveying the core dining experience of \"encountering art and surprise at every flavorful crossroads.\"",
    assets: {
      header: "/projects/p3/header.png",
      attached: [],
      gallery: [
        `/projects/p3/p3-02.png`,
        `/projects/p3/p3-03.png`,
        `/projects/p3/p3-04.png`,
        `/projects/p3/p3-05.png`,
        `/projects/p3/p3-06.png`,
        `/projects/p3/p3-07.png`,
        `/projects/p3/p3-08.png`,
        `/projects/p3/p3-09.png`,
      ],
    },
  },
  {
    id: "p4",
    brand: "somesome✖️超级猩猩",
    meta: {
      service: "联名礼盒设计",
      date: "",
      industry: "大健康行业",
    },
    description:
      "我们为somesome和超级猩猩打造的联名礼盒【猩动力超能补给箱】，在设计上我们以somesome的\"姜黄生姜柠檬饮\"和\"不老梅姜黄饮\"中的原料与超级猩猩具有代表性的团课及运动器械元素相结合，打造趣味生姜IP形象和运动场景的结合，用具有趣味性的插画形式来展现本次联名主视觉及产品延展。",
    descriptionEn:
      "For the co-branded gift box \"Xing Power Energy Supply Box\" we designed for somesome and SuperMonkey, we combined the ingredients from somesome's \"turmeric-ginger-lemon drink\" and \"anti-aging-plum turmeric drink\" with SuperMonkey's signature group class and fitness equipment elements—crafting a playful fusion of the ginger IP and sports scenarios, and using fun illustration to present the co-branded main visual and product extensions.",
    assets: {
      header: "/projects/p4/header.png",
      attached: ["/projects/p4/p4-8.png"],
      gallery: [
        "/projects/p4/p4-6.png",
        "/projects/p4/p4-4.png",
        "/projects/p4/p4-5.png",
        "/projects/p4/p4-7.png",
        "/projects/p4/p4-2.png",
        "/projects/p4/p4.png",
        "/projects/p4/p4-3.png",
      ],
    },
  },
  {
    id: "p2",
    brand: "aevum",
    meta: {
      service: "品牌全案设计",
      date: "2025.11.15",
      industry: "家居行业",
    },
    description:
      '品牌"Aevum"源自拉丁语"永恒的时间"，品牌Slogan"以流动的几何，描绘时间中的色彩"象征家居设计与时空的共生关系——家具不仅是空间物件，更是承载时光记忆的容器。Logo设计我们以房子轮廓为符号结合手写感字母象征"家"与"时空轨迹"的交叠，插画设计上我们用简约手绘展现功能美学，聚焦结构本质而非细节堆砌，通过动态几何线条打破静态家居的刻板印象，隐喻时间流动，形成独属于Aevum的家居色谱。',
    descriptionEn:
      'The brand "Aevum" originates from the Latin word for "eternal time". The brand slogan "depicting colors in time with flowing geometry" symbolizes the symbiotic relationship between home design and space-time—furniture is not just a spatial object, but a container carrying the memories of time. For the logo design, we combined the house outline as a symbol with hand-written letters to symbolize the overlap of "home" and "time-space trajectory". For the illustration design, we used simple hand-drawings to display functional aesthetics, focusing on structural essence rather than detail piling. Through dynamic geometric lines, we broke the stereotype of static home furnishings, implying the flow of time and forming a home spectrum unique to Aevum.',
    assets: {
      header: "/projects/p2/header.png",
      attached: [],
      gallery: [
        "/projects/p2/p2-02.png",
        "/projects/p2/p2-03.png",
        "/projects/p2/p2-04.png",
        "/projects/p2/p2-05.png",
        "/projects/p2/p2-06.png",
        "/projects/p2/p2-07.png",
        "/projects/p2/p2-08.png",
        "/projects/p2/p2-09.png",
      ],
    },
  },
  {
    id: "p5",
    brand: "pawprint",
    meta: {
      service: "品牌全案设计",
      date: "",
      industry: "宠物行业",
    },
    description:
      "Pawprint是一个为新生代宠物主打造的趣味宠物生活方式品牌，围绕现代年轻养宠人群对趣味生活与情感治愈的需求展开。我们使用大胆轻快的色彩和可爱生动的宠物插画，来传递品牌趣味治愈的调性，用生活化的插画场景，形成毛孩子的生活剧场，增强消费者与产品的情感链接，让每一件产品都体现了宠物的「爱与陪伴」。使用牛皮纸与明快的色彩相结合，即保留自然质感又年轻化，传递精致生活不必刻意精致的态度，契合年轻人「松弛感养宠」的生活方式。",
    descriptionEn:
      "Pawprint is a fun pet lifestyle brand created for the new generation of pet owners, built around modern young pet owners' needs for playful living and emotional healing. We use bold, lively colors and cute, vivid pet illustrations to convey the brand's playful and healing tone, forming a \"furry kids' life theater\" through lifelike illustration scenes that strengthen the emotional connection between consumers and products—every item reflects the \"love and companionship\" of pets. By combining kraft paper with bright colors, we preserve natural texture while staying youthful, conveying the attitude that refined living doesn't need to be deliberately refined, fitting the young generation's \"relaxed pet parenting\" lifestyle.",
    assets: {
      header: "/projects/p5/header.png",
      attached: [],
      gallery: [
        "/projects/p5/p5-12.png",
        "/projects/p5/p5-03.png",
        "/projects/p5/p5-04.png",
        "/projects/p5/p5-05.png",
        "/projects/p5/p5-06.png",
        "/projects/p5/p5-07.png",
        "/projects/p5/p5-08.png",
        "/projects/p5/p5-09.png",
        "/projects/p5/p5-10.png",
        "/projects/p5/p5-11.png",
      ],
    },
  },
  {
    id: "p6",
    brand: "tactease",
    meta: {
      service: "品牌全案设计",
      date: "",
      industry: "服饰行业",
    },
    description:
      'TactEase设计的核心是一个蜿蜒环绕、重复出现的"S"形曲线。这个形态灵感来源于袜子包裹脚踝时的自然褶皱，以及纱线本身的柔软绵延。它不是一个静态的图形，而是充满动感与弹性，视觉上就能传递出柔软、贴合、无拘束的舒适感。色彩策略大胆运用对比色，旨在平衡"舒适"的温和感与"潮流"的活力感，打破了中性色的沉闷，恰到好处地体现了品牌的年轻化定位，共同塑造了一个兼具舒适度与活力感、易于识别和记忆的潮流品牌形象。',
    descriptionEn:
      "At the heart of TactEase's design is a meandering, repeating \"S\"-shaped curve. The form draws inspiration from the natural folds of socks wrapping the ankle, and the soft, flowing continuity of yarn itself. It is not a static graphic but full of dynamism and elasticity, visually conveying a sense of softness, fit, and unrestricted comfort. The color strategy boldly uses contrasting colors, aiming to balance the gentleness of \"comfort\" with the energy of \"trend,\" breaking the dullness of neutrals and perfectly reflecting the brand's youthful positioning—together shaping a trendy brand image that combines comfort and vitality, easy to recognize and remember.",
    assets: {
      header: "/projects/p6/header.png",
      attached: [],
      gallery: [
        "/projects/p6/p6-02.png",
        "/projects/p6/p6-03.png",
        "/projects/p6/p6-04.png",
        "/projects/p6/p6-05.png",
        "/projects/p6/p6-06.png",
        "/projects/p6/p6-07.png",
        "/projects/p6/p6-08.png",
      ],
    },
  },
  {
    id: "p7",
    brand: "CookieJar",
    meta: {
      service: "品牌升级 + 礼盒包装设计",
      date: "",
      industry: "烘焙行业",
    },
    description:
      "CookieJar的每一块小圆饼都来自星级主厨的配比测试与手作工艺，选择高品质天然原料，坚持低糖低脂配方，不用重油堆砌口感，口感浓郁不油腻。这次品牌升级我们为CookieJar设计了全新的视觉体系，主logo设计字母末端似奶油滴落感弧度，传递精致手工感，手绘感logo轻松愉快适配节日氛围；罐子图形设计，传达\"开罐有惊喜\"趣味性，品牌色用咖啡色、明黄色和粉色共同打造温暖不甜腻的烘焙品牌视觉，和品牌专属纹样结合打造礼盒包装。",
    descriptionEn:
      "Every small round cookie from CookieJar is born from a star chef's proportion testing and handcrafted craft—using high-quality natural ingredients, insisting on a low-sugar and low-fat formula, never relying on heavy oils to build texture, with a rich yet non-greasy taste. For this brand upgrade, we designed an entirely new visual system for CookieJar: the main logo's letter terminals feature a cream-drip-like curvature, conveying a refined handcrafted feel; the hand-drawn logo is relaxed and joyful, fitting the festive atmosphere; the jar graphic design conveys the playfulness of \"a surprise when you open the jar\"; and the brand colors of coffee brown, bright yellow, and pink jointly build a warm yet non-cloying bakery visual, combined with brand-exclusive patterns to craft the gift box packaging.",
    assets: {
      header: "/projects/p7/header.png",
      attached: [],
      gallery: [
        "/projects/p7/p7-08.png",
        "/projects/p7/p7-gallery-extra.png",
        "/projects/p7/p7-02.png",
        "/projects/p7/p7-03.png",
        "/projects/p7/p7-04.png",
        "/projects/p7/p7-05.png",
        "/projects/p7/p7-06.png",
        "/projects/p7/p7-07.png",
      ],
    },
  },
  {
    id: "p8",
    brand: "Scoopie",
    meta: {
      service: "品牌全案设计",
      date: "",
      industry: "食品行业",
    },
    description:
      'Scoopie是一个以"手工感，治愈"为定位的希腊酸奶品牌，以"Keep it Real, Scoop the Feel"为核心理念。设计上我们放弃严肃的工业感包装，以"手工感的真实"贯穿始终，回归酸奶制作中最动人的两个瞬间：阳光注入奶脂的温暖，与勺子挖起凝固酸奶的满足，传递品牌有温度、有触感、带着呼吸的灵动气质。色彩上我们采用黄蓝配色，是日光与海风的对话，纯净清爽，强化视觉记忆点。几何图形可随产品线或活动变化作为版面的辅助图形，像"酸奶块"一样自由散落，传达"一碗一勺，即是全部"的核心体验。',
    descriptionEn:
      'Scoopie is a Greek yogurt brand positioned around "handcrafted feel and healing," with the core concept of "Keep it Real, Scoop the Feel." In design, we abandon serious industrial-feel packaging and let "the authenticity of handcraft" run throughout, returning to the two most touching moments of yogurt making: the warmth of sunlight pouring into the milk fat, and the satisfaction of a spoon scooping up thickened yogurt—conveying a brand character that has temperature, has texture, and breathes with liveliness. For color, we use a yellow-blue palette, a dialogue between sunlight and sea breeze, pure and refreshing, strengthening the visual memory point. Geometric shapes can change with product lines or campaigns as auxiliary layout graphics, freely scattered like "yogurt blocks," conveying the core experience that "one bowl, one spoon, is everything."',
    assets: {
      header: "/projects/p8/header.png",
      attached: [],
      gallery: [
        "/projects/p8/p8-02.png",
        "/projects/p8/p8-03.png",
        "/projects/p8/p8-04.png",
        "/projects/p8/p8-10.png",
        "/projects/p8/p8-06.png",
        "/projects/p8/p8-07.png",
        "/projects/p8/p8-08.png",
        "/projects/p8/p8-09.png",
      ],
    },
  },
  {
    id: "p9",
    brand: "Zoonique",
    meta: {
      service: "品牌全案设计",
      date: "",
      industry: "宠物行业",
    },
    description:
      "Zoonique宠物生活方式品牌，专注宠物服装定制及生活方式周边，传递「温暖陪伴」与「个性化宠物生活」理念，我们以主理人3只宠物小狗为品牌IP核心，强化真实性与情感共鸣，以奔跑、跳跃的动作传递品牌活力，我们为每只狗狗设计了3套服装：基础款、主题款、定制款，覆盖品牌核心产品线。品牌色上我们选用了治愈系基调，传递清新温暖感。同时我们将IP形象做了多维度延展应用设计，从设计了趣味导视系统及产品周边，贯穿品牌的治愈感与趣味性。",
    descriptionEn:
      "Zoonique is a pet lifestyle brand focused on custom pet apparel and lifestyle merchandise, conveying the philosophy of \"warm companionship\" and \"personalized pet living.\" We center the brand IP on the founder's three pet dogs, reinforcing authenticity and emotional resonance, and use running and leaping actions to convey brand vitality. For each dog, we designed three sets of apparel: basics, themed, and custom—covering the brand's core product line. For brand colors, we chose healing tones, conveying freshness and warmth. At the same time, we extended the IP image into multi-dimensional application design, from playful wayfinding systems to product merchandise, running through the brand's healing feel and playfulness.",
    assets: {
      header: "/projects/p9/p9-03.png",
      attached: [],
      gallery: [
        "/projects/p9/header.png",
        "/projects/p9/p9-04.png",
        "/projects/p9/p9-05.png",
        "/projects/p9/p9-06.png",
        "/projects/p9/p9-07.png",
        "/projects/p9/p9-08.png",
        "/projects/p9/p9-09.png",
        "/projects/p9/p9-10.png",
        "/projects/p9/p9-11.png",
        "/projects/p9/p9-12.png",
      ],
    },
  },
  {
    id: "p10",
    brand: "THE BITE",
    meta: {
      service: "品牌全案设计",
      date: "",
      industry: "餐饮行业",
    },
    description:
      'THE BITE是一家以"一口激活年轻能量 | One Bite to Energize"为核心理念，通过多巴胺配色、小金毛IP设计和温暖趣味的表达，定义年轻群体的美式汉堡快餐美学体验。设计上我们摒弃传统快餐品牌的工业化冰冷感，转而拥抱一种"可口的愉悦感"——它不仅是味觉的满足，更是视觉与情感的双重体验，传递品牌发自内心的愉悦与分享精神。色彩上我们采用多巴胺配色，让品牌整体明亮与温暖。可爱的小金毛IP天生具有友好、快乐的特质，作为品牌在不同场景中的动态出现，将零散的消费触点串联成有温度的品牌叙事，增强品牌识别度与亲和力。',
    descriptionEn:
      'THE BITE is built around the core concept of "one bite to energize the young | One Bite to Energize," using dopamine color schemes, a golden retriever IP, and warm, playful expression to define the American burger fast-food aesthetic experience for younger groups. In design, we abandon the industrial coldness of traditional fast-food brands, instead embracing a "delicious sense of pleasure"—it is not only the satisfaction of taste, but a dual experience of vision and emotion, conveying the brand\'s heartfelt joy and spirit of sharing. For color, we use a dopamine palette, making the brand overall bright and warm. The cute golden retriever IP is naturally friendly and joyful; as the brand\'s dynamic presence across different scenes, it strings scattered consumer touchpoints into a warm brand narrative, strengthening brand recognition and affinity.',
    assets: {
      header: "/projects/p10/header.png",
      attached: [],
      gallery: [
        "/projects/p10/p10-05.png",
        "/projects/p10/p10-06.png",
        "/projects/p10/p10-01.png",
        "/projects/p10/p10-03.png",
        "/projects/p10/p10-04.png",
        "/projects/p10/p10-07.png",
        "/projects/p10/p10-08.png",
        "/projects/p10/p10-09.png",
      ],
    },
  },
  {
    id: "p11",
    brand: "OhBake",
    meta: {
      service: "品牌全案设计",
      date: "",
      industry: "烘焙行业",
    },
    description:
      "ohbake是一家韩系烘焙品牌店，我们围绕「小熊掌心的甜趣研究所」概念，构建\"年轻化、治愈感、社交化\"的韩系烘焙品牌形象，通过萌趣IP与色彩美学传递\"甜品即幸福感\"的情感价值。色彩上我们采用软fufu的淡蓝+甜度爆表的樱花粉做主调，双主色碰撞形成\"甜而不腻\"的视觉张力，打造治愈甜品社交场合！主IP是一只小熊研究员，以圆润线条与动态表情打造\"软萌\"小熊形象，通过生活化场景插画，塑造拟人化陪伴感，降低消费者与品牌的距离阈值。",
    descriptionEn:
      "OhBake is a Korean-style bakery brand. Built around the concept of \"the sweet fun research lab in the bear's paw,\" we construct a Korean bakery brand image of \"youthful, healing, and social,\" conveying the emotional value that \"dessert equals happiness\" through cute IP and color aesthetics. For color, we use soft baby blue and cherry blossom pink as the main tones—the collision of two primary colors creates a visual tension of \"sweet but not cloying,\" crafting a healing dessert social occasion. The main IP is a bear researcher, with rounded lines and dynamic expressions building a \"soft and cute\" bear image; through lifelike scene illustrations, we shape a personified sense of companionship, lowering the distance threshold between consumers and the brand.",
    assets: {
      header: "/projects/p11/header.png",
      attached: [],
      gallery: [
        "/projects/p11/p11-02.png",
        "/projects/p11/p11-03.png",
        "/projects/p11/p11-04.png",
        "/projects/p11/p11-05.png",
        "/projects/p11/p11-06.png",
        "/projects/p11/p11-07.png",
        "/projects/p11/p11-08.png",
        "/projects/p11/p11-09.png",
        "/projects/p11/p11-10.png",
      ],
    },
  },
  {
    id: "p12",
    brand: "Pureo",
    meta: {
      service: "品牌全案设计",
      date: "",
      industry: "食品行业",
    },
    description:
      '在和品牌主理人的沟通中，我们了解到Pureo品牌核心在于传递天然纯粹、活力趣味的愉悦。因此在logo设计中，我们采用定制化的手绘感字体呈现"Pureo"，传递出手作的温度感和自然有机的韵味，品牌核心视觉形象为四种果蔬的抽象插画，象征着产品的多元风味和丰富营养来源。我们还为品牌设计了不同的格纹辅助底纹，为品牌视觉注入结构感、活力感与视觉线索。色彩直接源于新鲜果蔬本身，直观传递天然和健康的属性。',
    descriptionEn:
      'Through communication with the brand founder, we understood that the core of Pureo lies in conveying the pleasure of natural purity and vibrant playfulness. Therefore, in logo design, we use a customized hand-drawn font to present "Pureo," conveying the warmth of craftsmanship and the charm of natural organics. The brand\'s core visual identity features abstract illustrations of four fruits and vegetables, symbolizing the diverse flavors and rich nutritional sources of the products. We also designed different plaid auxiliary patterns for the brand, injecting structure, vitality, and visual cues into the brand\'s visual. The colors are drawn directly from fresh fruits and vegetables themselves, intuitively conveying the attributes of naturalness and health.',
    assets: {
      header: "/projects/p12/header.png",
      attached: [],
      gallery: [
        "/projects/p12/p12-02.png",
        "/projects/p12/p12-03.png",
        "/projects/p12/p12-04.png",
        "/projects/p12/p12-05.png",
        "/projects/p12/p12-06.png",
        "/projects/p12/p12-07.png",
        "/projects/p12/p12-08.png",
        "/projects/p12/p12-09.png",
      ],
    },
  },
  {
    id: "p13",
    brand: "Yumyap Bakery",
    meta: {
      service: "品牌全案设计",
      date: "",
      industry: "烘焙行业",
    },
    description:
      '在Yamyap Bakery的项目中，我们以主理人自家小金毛为灵感设计ip形象"小狗烘焙师"，打造韩式可爱风格+烘焙治愈力的年轻化烘焙品牌。我们为ip设计了4个烘焙制作状态的小插画，将笨拙而真诚的烘焙过程转化为视觉童话，通过有趣的"小狗烘焙日记"来强调"用心烘焙"的核心价值和温暖的治愈力。整体色系我们采用高饱和撞色激发多巴胺分泌，契合年轻客群审美，打造甜而不腻的韩式美学烘焙品牌。',
    descriptionEn:
      'In the Yumyap Bakery project, we drew inspiration from the founder\'s own golden retriever to design the IP image of the "puppy baker," crafting a youthful bakery brand that combines Korean cute style with baking healing power. We designed four small illustrations of the IP in different baking-making states, transforming the clumsy yet sincere baking process into a visual fairy tale; through the fun "Puppy Baking Diary," we emphasize the core value of "baking with heart" and the warm healing power. For the overall color scheme, we use high-saturation contrasting colors to stimulate dopamine, fitting the aesthetic of young customer groups and crafting a Korean aesthetic bakery brand that is sweet but not cloying.',
    assets: {
      header: "/projects/p13/header.png",
      attached: [],
      gallery: [
        "/projects/p13/yamyap-02.png",
        "/projects/p13/yamyap-03.png",
        "/projects/p13/yamyap-04.png",
        "/projects/p13/yamyap-05.png",
        "/projects/p13/yamyap-06.png",
        "/projects/p13/yamyap-07.png",
        "/projects/p13/yamyap-08.png",
        "/projects/p13/yamyap-09.png",
        "/projects/p13/yamyap-10.png",
      ],
    },
  },
  {
    id: "p14",
    brand: "Meow Cafe",
    meta: {
      service: "品牌全案设计",
      date: "",
      industry: "咖啡行业",
    },
    description:
      'Meow Cafe的品牌视觉设计以"猫咪的治愈力"为核心，我们将猫咪的灵动与咖啡文化巧妙结合，传递出轻松、治愈、愉悦的品牌调性，为消费者带来独特的视觉体验和情感共鸣。颜色上我们采用亮黄色、蓝色和粉色作为主色调，三种色彩的碰撞既充满视觉冲击力，形成独特的品牌记忆点。Meow Cafe的品牌视觉设计通过猫咪与咖啡的结合，打造了一个充满温度与治愈力的品牌形象，在情感上引发共鸣，为品牌注入持久的生命力。',
    descriptionEn:
      'Meow Cafe\'s brand visual design centers on the "healing power of cats." We cleverly combine the liveliness of cats with coffee culture, conveying a relaxed, healing, and joyful brand tone, bringing consumers a unique visual experience and emotional resonance. For color, we use bright yellow, blue, and pink as the main tones; the collision of the three colors is full of visual impact, forming a unique brand memory point. Meow Cafe\'s brand visual design, through the combination of cats and coffee, crafts a brand image full of warmth and healing power, resonating emotionally and injecting lasting vitality into the brand.',
    assets: {
      header: "/projects/p14/header.png",
      attached: [],
      gallery: [
        "/projects/p14/p14-02.png",
        "/projects/p14/p14-03.png",
        "/projects/p14/p14-04.png",
        "/projects/p14/p14-05.png",
        "/projects/p14/p14-06.png",
        "/projects/p14/p14-07.png",
        "/projects/p14/p14-08.png",
        "/projects/p14/p14-09.png",
      ],
    },
  },
  {
    id: "p15",
    brand: "Furora弗若",
    meta: {
      service: "品牌全案设计",
      date: "",
      industry: "宠物用品",
    },
    description:
      'Furora弗若是一家宠物生活方式品牌，主理人希望弗若能为毛孩子带来温暖光芒，因此我们将"家"定义为不仅是物理意义上的居所，更是人宠之间情感交融的避风港。在弗若的世界里，家不是冰冷的钢筋水泥，而是充满色彩、自由与包容的心灵栖息地。我们将"可爱温馨的小房子"提炼为品牌的辅助图形，无论是在产品包装、手提袋还是线下门店的门头设计中，都可以不断强化"家"的核心概念。鼓励宠物在家中释放天性，正如小狗 Roro 踩滑板、自拍的活泼模样，我们希望每一个来到弗若的生命都能感受到无拘无束的快乐。',
    descriptionEn:
      'Furora is a pet lifestyle brand. The founder hopes Furora can bring warm light to their fur kids, so we defined "home" as more than a physical dwelling — it\'s an emotional harbor where humans and pets share warmth. In Furora\'s world, home isn\'t cold concrete, but a colorful, free, and inclusive soul habitat. We distilled the "cute cozy little house" into the brand\'s auxiliary graphic, reinforcing the core concept of "home" across product packaging, paper bags, and storefront signage. We encourage pets to be themselves at home — just like the dog Roro skateboarding and taking selfies, we hope every creature that comes to Furora feels the joy of being unconstrained.',
    assets: {
      header: "/projects/p15/header.png",
      attached: [],
      gallery: [
        "/projects/p15/p15-02.png",
        "/projects/p15/p15-03.png",
        "/projects/p15/p15-04.png",
        "/projects/p15/p15-05.png",
        "/projects/p15/p15-06.png",
        "/projects/p15/p15-07.png",
        "/projects/p15/p15-08.png",
        "/projects/p15/p15-10.png",
        "/projects/p15/p15-11.png",
        "/projects/p15/p15-12.png",
      ],
    },
  },
  {
    id: "p16",
    brand: "Euphor",
    meta: {
      service: "品牌全案设计",
      date: "",
      industry: "家居用品",
    },
    description:
      'Euphor是一家家居品牌集合店，我们在为Euphor 的设计视觉语言选择了一种"反叛"的姿态。Euphor 的视觉基底由最纯粹的红、黄、蓝三原色构成。它们以最直接、最原始的姿态碰撞，这种色彩策略是情绪的具象化，大面积的色块在粗糙的质感中相互交织，将高饱和的色彩沉淀为一种具有呼吸感的艺术表达。用粗糙的线条对抗精致，用原色的碰撞对抗平庸，用手绘的温度对抗冷漠。在 Euphor 的世界里，多巴胺不是一种浮夸的潮流，而是一种可以被触摸、被感受、被生活化的真实情绪。这种拙感，正是我们对"悦己"最诚恳的表达。',
    descriptionEn:
      'Euphor is a multi-brand home goods store. We chose a "rebellious" stance for Euphor\'s visual language. Euphor\'s visual foundation consists of the purest red, yellow, and blue primaries. They collide in their most direct, primitive form — this color strategy externalizes emotion; large color blocks interweave within rough textures, settling the high-saturation colors into an artistic expression that breathes. Rough lines counter refinement, primary-color collisions counter the ordinary, the warmth of hand-drawn marks counters indifference. In Euphor\'s world, dopamine isn\'t a flashy trend but a real emotion that can be touched, felt, and lived. This clumsiness is our most sincere expression of "pleasing oneself."',
    assets: {
      header: "/projects/p16/header.png",
      attached: [],
      gallery: [
        "/projects/p16/p16-02.png",
        "/projects/p16/p16-03.png",
        "/projects/p16/p16-05.png",
        "/projects/p16/p16-04.png",
        "/projects/p16/p16-06.png",
        "/projects/p16/p16-07.png",
        "/projects/p16/p16-08.png",
      ],
    },
  },
]

export { projects }

const PROJECTS_BY_ID: Record<string, Project> = Object.fromEntries(
  projects.map((p) => [p.id, p])
)

export function getProjectById(id: string): Project | null {
  return PROJECTS_BY_ID[id] ?? null
}
