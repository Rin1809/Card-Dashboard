export const translations = {
  vi: {
    appTitle: "Rin Card Analytics",
    live: "Trực tuyến",
    loading: "Đang tải...",
    noData: "Không có dữ liệu.",
    overview: {
      totalVisits: "Tổng Lượt Truy Cập",
      uniqueVisitors: "Khách Truy Cập",
      totalInteractions: "Tổng Tương Tác",
      avgSessionDuration: "Thời Lượng Phiên (TB)",
      bounceRate: "Tỷ Lệ Thoát",
      unitSeconds: "s",
    },
    filters: {
      dateRange: "Khoảng thời gian",
      country: "Quốc gia",
      isp: "Nhà mạng",
      os: "Hệ điều hành",
      browser: "Trình duyệt",
      apply: "Áp dụng",
      reset: "Reset",
      all: "Tất cả",
      selected: "đã chọn",
    },
    charts: {
      visitorAnalytics: "Phân Tích Khách Truy Cập",
      timeAnalytics: "Phân Tích Theo Thời Gian",
      interactionAnalytics: "Phân Tích Tương Tác",
      geoNetworkAnalytics: "Phân Bố Địa Lý & Mạng",
      platformAnalytics: "Phân Tích Nền Tảng",
      activityHeatmap: "Heatmap Hoạt Động (30 ngày qua)",
      detailedInteractions: "Tương Tác Chi Tiết",
      botAnalysis: "Phân Tích Bot / Crawler",
      bounceRateTrend: "Xu Hướng Tỷ Lệ Thoát",
    },
    buttons: {
      ipDistribution: "Phân Bố IP",
      trend: "Xu Hướng",
      ranking: "Xếp Hạng",
      overview: "Tổng Quan",
      analysis: "Phân Tích",
      distribution: "Phân Bố",
      byTime: "Theo Giờ",
      byDay: "Theo Ngày",
      byWeek: "Theo Tuần",
      bySession: "Theo Buổi",
      interactionType: "Loại Tương Tác",
      pageViews: "Lượt Xem Trang",
      sessionDuration: "Thời Lượng Phiên",
      language: "Ngôn Ngữ",
      loyalty: "Mức Độ Quay Lại",
      country: "Quốc Gia",
      city: "Thành Phố",
      isp: "Nhà Mạng",
      byBrowser: "Theo Trình Duyệt",
      byOs: "Theo HĐH",
      aboutSection: "Mục About",
      galleryPhotos: "Ảnh Gallery",
      guestbook: "Guestbook",
      previous: "Trang trước",
      next: "Trang sau",
      page: "Trang"
    },
    tables: {
      ipAddress: "Địa chỉ IP",
      visitCount: "Số lần truy cập",
      visitCount_short: "lần",
      lastVisit: "Lần cuối truy cập",
    },
    chartLabels: {
      visits: "Lượt truy cập",
      sessions: "Số phiên",
      interactions: "Số lần tương tác",
      views: "Số lượt xem",
      visitors: "Số lượng khách",
      totalVisits: "Tổng lượt truy cập",
      newVisitors: "Khách mới",
      returningVisitors: "Khách quay lại",
      bounceRate: "Tỷ lệ thoát",
      languageSelection: "Số lần chọn",
      hourOfDay: "Giờ trong ngày",
      dayOfWeek: "Ngày trong tuần",
      viewedSection: "Lượt xem mục",
      viewedImage: "Lượt xem ảnh",
      submittedEntry: "Lượt gửi",
      image: "Ảnh",
      otherIPs: "Địa chỉ IP khác",
      days: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
      sessionDuration: {
        '0-10s': '0-10 giây',
        '10-30s': '10-30 giây',
        '30-60s': '30-60 giây',
        '1-5m': '1-5 phút',
        '5-10m': '5-10 phút',
        '10m+': '10+ phút'
      },
      visitorDistribution: {
        '1_time': '1 Lần (Khách mới)',
        '2-3_times': '2-3 Lần',
        '4-5_times': '4-5 Lần',
        '6+_times': '6+ Lần (Khách quen)'
      },
      timeOfDay: {
        morning: 'Sáng (05-11)',
        afternoon: 'Trưa & Chiều (12-16)',
        evening: 'Tối (17-21)',
        night: 'Đêm (22-04)'
      },
      period: {
        hour: "giờ (3 ngày qua)",
        day: "ngày (30 ngày qua)",
        week: "tuần (6 tháng qua)"
      }
    },
    footer: "Mizuki Analytics Dashboard",
    journey: {
        modalTitle: "Hành trình Khách truy cập: {{ip}}",
        selectSession: "Chọn một phiên để xem chi tiết",
        session: "Phiên",
        events: "sự kiện",
        duration: "Thời lượng",
        start: "Bắt đầu",
        eventLog: "Nhật ký Sự kiện",
        noEvents: "Không có sự kiện nào được ghi lại cho phiên này.",
        searchPlaceholder: "Nhập IP để xem hành trình...",
        viewJourney: "Xem Hành Trình",
        eventType: {
            language_selected: "Chọn ngôn ngữ: {{lang}}",
            view_changed: "Chuyển view: {{prev}} → {{curr}}",
            about_subsection_viewed: "Xem About: {{curr}}",
            gallery_image_viewed: "Xem ảnh Gallery #{{index}} ({{action}})",
            guestbook_entry_viewed: "Xem Guestbook: \"{{snippet}}\"",
            guestbook_entry_submitted: "Gửi Guestbook: {{name}} - \"{{snippet}}\"",
            unknown: "Hành động không xác định: {{type}}"
        }
    },
    annotations: {
      add: "Thêm Chú thích",
      placeholder: "Nhập chú thích cho hôm nay...",
      added: "Đã thêm chú thích!",
      annotatingFor: "Chú thích cho:",
      placeholderForDate: "Nhập chú thích cho ngày {{date}}...",
      resetSelection: "Bỏ chọn",
      authorPlaceholder: "Nhập tên của bạn...",
      manageButton: "Quản lý",
      managementTitle: "Quản lý Chú thích của bạn",
      editLabel: "Sửa",
      deleteLabel: "Xóa",
      saveLabel: "Lưu",
      cancelLabel: "Hủy",
      deleteConfirm: "Bạn có chắc muốn xóa chú thích này?",
      manageHelp: "Nhập tên để bật tính năng chú thích. Dùng tên cũ để xem lại và quản lý các chú thích đã tạo."
    }
  },
  en: {
    appTitle: "Rin Card Analytics",
    live: "Online",
    loading: "Loading...",
    noData: "No data available.",
    overview: {
      totalVisits: "Total Visits",
      uniqueVisitors: "Unique Visitors",
      totalInteractions: "Total Interactions",
      avgSessionDuration: "Avg. Session Duration",
      bounceRate: "Bounce Rate",
      unitSeconds: "s",
    },
    filters: {
      dateRange: "Date range",
      country: "Country",
      isp: "ISP",
      os: "Operating System",
      browser: "Browser",
      apply: "Apply",
      reset: "Reset",
      all: "All",
      selected: "selected",
    },
    charts: {
      visitorAnalytics: "Visitor Analytics",
      timeAnalytics: "Time Analytics",
      interactionAnalytics: "Interaction Analytics",
      geoNetworkAnalytics: "Geo & Network Distribution",
      platformAnalytics: "Platform Analytics",
      activityHeatmap: "Activity Heatmap (last 30 days)",
      detailedInteractions: "Detailed Interactions",
      botAnalysis: "Bot / Crawler Analysis",
      bounceRateTrend: "Bounce Rate Trend",
    },
    buttons: {
      ipDistribution: "IP Distribution",
      trend: "Trend",
      ranking: "Ranking",
      overview: "Overview",
      analysis: "Analysis",
      distribution: "Distribution",
      byTime: "By Hour",
      byDay: "By Day",
      byWeek: "By Week",
      bySession: "By Time of Day",
      interactionType: "Interaction Type",
      pageViews: "Page Views",
      sessionDuration: "Session Duration",
      language: "Language",
      loyalty: "Loyalty",
      country: "Country",
      city: "City",
      isp: "ISP",
      byBrowser: "By Browser",
      byOs: "By OS",
      aboutSection: "About Section",
      galleryPhotos: "Gallery Photos",
      guestbook: "Guestbook",
      previous: "Previous",
      next: "Next",
      page: "Page"
    },
    tables: {
      ipAddress: "IP Address",
      visitCount: "Visit Count",
      visitCount_short: "visits",
      lastVisit: "Last Visit",
    },
    chartLabels: {
      visits: "Visits",
      sessions: "Sessions",
      interactions: "Interactions",
      views: "Views",
      visitors: "Number of visitors",
      totalVisits: "Total Visits",
      newVisitors: "New Visitors",
      returningVisitors: "Returning Visitors",
      bounceRate: "Bounce Rate",
      languageSelection: "Selections",
      hourOfDay: "Hour of Day",
      dayOfWeek: "Day of Week",
      viewedSection: "Section Views",
      viewedImage: "Image Views",
      submittedEntry: "Submissions",
      image: "Image",
      otherIPs: "Other IPs",
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      sessionDuration: {
        '0-10s': '0-10 seconds',
        '10-30s': '10-30 seconds',
        '30-60s': '30-60 seconds',
        '1-5m': '1-5 minutes',
        '5-10m': '5-10 minutes',
        '10m+': '10+ minutes'
      },
      visitorDistribution: {
        '1_time': '1 Time (New Visitor)',
        '2-3_times': '2-3 Times',
        '4-5_times': '4-5 Times',
        '6+_times': '6+ Times (Returning)'
      },
      timeOfDay: {
        morning: 'Morning (05-11)',
        afternoon: 'Afternoon (12-16)',
        evening: 'Evening (17-21)',
        night: 'Night (22-04)'
      },
      period: {
        hour: "hour (last 3 days)",
        day: "day (last 30 days)",
        week: "week (last 6 months)"
      }
    },
    footer: "Mizuki Analytics Dashboard",
    journey: {
        modalTitle: "Visitor Journey: {{ip}}",
        selectSession: "Select a session to see details",
        session: "Session",
        events: "events",
        duration: "Duration",
        start: "Started",
        eventLog: "Event Log",
        noEvents: "No events were recorded for this session.",
        searchPlaceholder: "Enter IP to view journey...",
        viewJourney: "View Journey",
        eventType: {
            language_selected: "Selected language: {{lang}}",
            view_changed: "Changed view: {{prev}} → {{curr}}",
            about_subsection_viewed: "Viewed About: {{curr}}",
            gallery_image_viewed: "Viewed Gallery image #{{index}} ({{action}})",
            guestbook_entry_viewed: "Viewed Guestbook: \"{{snippet}}\"",
            guestbook_entry_submitted: "Submitted Guestbook: {{name}} - \"{{snippet}}\"",
            unknown: "Unknown action: {{type}}"
        }
    },
    annotations: {
      add: "Add Annotation",
      placeholder: "Enter annotation for today...",
      added: "Annotation added!",
      annotatingFor: "Annotating for:",
      placeholderForDate: "Enter annotation for {{date}}...",
      resetSelection: "Reset selection",
      authorPlaceholder: "Enter your name...",
      manageButton: "Manage",
      managementTitle: "Manage Your Annotations",
      editLabel: "Edit",
      deleteLabel: "Delete",
      saveLabel: "Save",
      cancelLabel: "Cancel",
      deleteConfirm: "Are you sure you want to delete this annotation?",
      manageHelp: "Enter a name to enable annotations. Use the same name to see and manage your previous notes."
    }
  },
  ja: {
    appTitle: "Rinカードアナリティクス",
    live: "オンライン",
    loading: "読み込み中...",
    noData: "データがありません。",
    overview: {
      totalVisits: "総訪問数",
      uniqueVisitors: "ユニークビジター",
      totalInteractions: "総インタラクション",
      avgSessionDuration: "平均セッション時間",
      bounceRate: "直帰率",
      unitSeconds: "秒",
    },
    filters: {
      dateRange: "期間",
      country: "国",
      isp: "ISP",
      os: "OS",
      browser: "ブラウザ",
      apply: "適用",
      reset: "リセット",
      all: "すべて",
      selected: "件選択",
    },
    charts: {
      visitorAnalytics: "訪問者分析",
      timeAnalytics: "時間分析",
      interactionAnalytics: "インタラクション分析",
      geoNetworkAnalytics: "地理・ネットワーク分布",
      platformAnalytics: "プラットフォーム分析",
      activityHeatmap: "アクティビティヒートマップ (過去30日)",
      detailedInteractions: "詳細なインタラクション",
      botAnalysis: "ボット・クローラー分析",
      bounceRateTrend: "直帰率の推移",
    },
    buttons: {
      ipDistribution: "IP分布",
      trend: "推移",
      ranking: "ランキング",
      overview: "概要",
      analysis: "分析",
      distribution: "分布",
      byTime: "時間別",
      byDay: "日別",
      byWeek: "週別",
      bySession: "時間帯別",
      interactionType: "インタラクション種別",
      pageViews: "ページビュー",
      sessionDuration: "セッション時間",
      language: "言語",
      loyalty: "リピート率",
      country: "国",
      city: "都市",
      isp: "ISP",
      byBrowser: "ブラウザ別",
      byOs: "OS別",
      aboutSection: "Aboutセクション",
      galleryPhotos: "ギャラリー写真",
      guestbook: "ゲストブック",
      previous: "前へ",
      next: "次へ",
      page: "ページ"

    },
    tables: {
      ipAddress: "IPアドレス",
      visitCount: "訪問回数",
      visitCount_short: "回",
      lastVisit: "最終訪問",
    },
    chartLabels: {
      visits: "訪問数",
      sessions: "セッション数",
      interactions: "インタラクション数",
      views: "ビュー数",
      visitors: "訪問者数",
      totalVisits: "総訪問数",
      newVisitors: "新規訪問者",
      returningVisitors: "リピーター",
      bounceRate: "直帰率",
      languageSelection: "選択回数",
      hourOfDay: "時間",
      dayOfWeek: "曜日",
      viewedSection: "セクション閲覧数",
      viewedImage: "画像閲覧数",
      submittedEntry: "投稿数",
      image: "画像",
      otherIPs: "その他のIP",
      days: ['月', '火', '水', '木', '金', '土', '日'],
      sessionDuration: {
        '0-10s': '0-10秒',
        '10-30s': '10-30秒',
        '30-60s': '30-60秒',
        '1-5m': '1-5分',
        '5-10m': '5-10分',
        '10m+': '10分以上'
      },
      visitorDistribution: {
        '1_time': '1回 (新規)',
        '2-3_times': '2-3回',
        '4-5_times': '4-5回',
        '6+_times': '6回以上 (リピーター)'
      },
      timeOfDay: {
        morning: '朝 (05-11)',
        afternoon: '昼 (12-16)',
        evening: '夕方 (17-21)',
        night: '夜 (22-04)'
      },
       period: {
        hour: "時間 (過去3日間)",
        day: "日 (過去30日間)",
        week: "週 (過去6ヶ月)"
      }
    },
    footer: "Mizuki アナリティクスダッシュボード",
    journey: {
        modalTitle: "訪問者のジャーニー: {{ip}}",
        selectSession: "詳細を見るセッションを選択",
        session: "セッション",
        events: "イベント",
        duration: "滞在時間",
        start: "開始",
        eventLog: "イベントログ",
        noEvents: "このセッションのイベントは記録されていません。",
        searchPlaceholder: "IPを入力してジャーニーを表示...",
        viewJourney: "ジャーニー表示",
        eventType: {
            language_selected: "言語選択: {{lang}}",
            view_changed: "ビュー変更: {{prev}} → {{curr}}",
            about_subsection_viewed: "About閲覧: {{curr}}",
            gallery_image_viewed: "ギャラリー画像閲覧 #{{index}} ({{action}})",
            guestbook_entry_viewed: "ゲストブック閲覧: \"{{snippet}}\"",
            guestbook_entry_submitted: "ゲストブック投稿: {{name}} - \"{{snippet}}\"",
            unknown: "不明なアクション: {{type}}"
        }
    },
    annotations: {
      add: "注釈を追加",
      placeholder: "今日の注釈を入力...",
      added: "注釈が追加されました！",
      annotatingFor: "注釈対象:",
      placeholderForDate: "{{date}}の注釈を入力...",
      resetSelection: "選択解除",
      authorPlaceholder: "名前を入力...",
      manageButton: "管理",
      managementTitle: "自分の注釈を管理",
      editLabel: "編集",
      deleteLabel: "削除",
      saveLabel: "保存",
      cancelLabel: "キャンセル",
      deleteConfirm: "この注釈を削除してもよろしいですか？",
      manageHelp: "名前を入力して注釈機能を有効にします。同じ名前を使用すると、以前の注釈を表示および管理できます。"
    }
  }
};

export type Locale = keyof typeof translations;