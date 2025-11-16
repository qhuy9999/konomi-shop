export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'vi' as const,
  messages: {
    vi: {
      common: {
        welcome: 'Chào mừng đến Konomi Shop',
        language: 'Ngôn ngữ',
        home: 'Trang chủ',
        products: 'Sản phẩm',
        cart: 'Giỏ hàng',
        account: 'Tài khoản',
        logout: 'Đăng xuất',
        login: 'Đăng nhập',
        signup: 'Đăng ký',
        addToCart: 'Thêm vào giỏ',
        processing: 'Đang xử lý...'
      },
      nav: {
        home: 'Trang Chủ',
        products: 'Sản Phẩm',
        about: 'Về Chúng Tôi',
        contact: 'Liên Hệ'
      },
      footer: {
        contact: 'Liên hệ',
        hotline: 'Hotline',
        email: 'Email',
        office: 'Văn phòng',
        hours: 'Giờ làm việc',
        guide: 'Hướng dẫn mua hàng',
        search: 'Cách tìm kiếm sản phẩm',
        order: 'Cách đặt hàng',
        payment: 'Phương thức thanh toán',
        promotions: 'Các khuyến mãi & ưu đãi',
        shipping: 'Giao hàng & hoàn trả',
        policy: 'Chính sách giao hàng',
        fees: 'Phí vận chuyển',
        returns: 'Chính sách hoàn trả & đổi trả',
        tracking: 'Theo dõi đơn hàng',
        terms: 'Điều khoản & chính sách',
        termsOfUse: 'Điều khoản sử dụng',
        privacy: 'Chính sách bảo mật',
        cookies: 'Chính sách cookies',
        about: 'Về chúng tôi',
        copyright: 'Bản quyền 2025 Konomi Shop. Tất cả các quyền được bảo lưu.'
      },
      auth: {
        signin: 'Đăng nhập',
        signup: 'Đăng ký',
        email: 'Email',
        username: 'Username',
        password: 'Mật khẩu',
        confirmPassword: 'Xác nhận mật khẩu',
        firstName: 'Tên',
        lastName: 'Họ',
        phoneNumber: 'Số điện thoại',
        forgotPassword: 'Quên mật khẩu?',
        rememberMe: 'Ghi nhớ tôi',
        noAccount: 'Chưa có tài khoản?',
        haveAccount: 'Đã có tài khoản?',
        signInTitle: 'Đăng Nhập Tài Khoản',
        signInDescription: 'Nhập thông tin của bạn để tiếp tục',
        signInButton: 'Đăng Nhập',
        signUpTitle: 'Tạo Tài Khoản Mới',
        signUpDescription: 'Đăng ký để trở thành thành viên của chúng tôi',
        signUpButton: 'Đăng Ký',
        otpTitle: 'Xác Minh Email',
        otpDescription: 'Nhập mã OTP đã được gửi đến email của bạn',
        otpCode: 'Mã OTP',
        otpVerifyButton: 'Xác Minh',
        otpResendButton: 'Gửi Lại OTP',
        otpCodeSentTo: 'Mã xác nhận 6 chữ số đã được gửi đến email:',
        otpPlaceholder: 'Nhập 6 chữ số',
        verifyEmailAgain: 'Xác nhận Email lại',
        reopenOTPModal: 'Mở lại Modal OTP',
        forgotPasswordTitle: 'Quên mật khẩu?',
        forgotPasswordDescription: 'Nhập email của bạn để nhận hướng dẫn khôi phục mật khẩu',
        forgotPasswordButton: 'Gửi Hướng Dẫn',
        resetPasswordTitle: 'Đặt lại mật khẩu',
        resetPasswordDescription: 'Nhập mã xác nhận và mật khẩu mới',
        resetCode: 'Mã xác nhận',
        newPassword: 'Mật khẩu mới',
        confirmNewPassword: 'Xác nhận mật khẩu mới',
        resetPasswordButton: 'Đặt lại mật khẩu',
        backButton: 'Quay Lại',
        backToSignIn: 'Quay Lại Đăng Nhập',
        addressOptional: 'Địa chỉ (Tuỳ chọn)',
        billingAddress: 'Địa chỉ thanh toán',
        deliveryAddress: 'Địa chỉ giao hàng',
        streetAddress: 'Địa chỉ đường phố',
        city: 'Thành phố',
        province: 'Tỉnh/Thành phố',
        zipCode: 'Mã bưu điện',
        country: 'Quốc gia',
        showAddress: '▶ Thêm địa chỉ',
        hideAddress: '▼ Ẩn địa chỉ',
        phoneNumberOptional: 'Số điện thoại (Tuỳ chọn)',
        validation: {
          usernameRequired: 'Username hoặc email bắt buộc',
          passwordRequired: 'Mật khẩu bắt buộc',
          emailRequired: 'Email bắt buộc',
          emailInvalid: 'Email không hợp lệ',
          usernameMinLength: 'Username phải có ít nhất 3 ký tự',
          usernameMaxLength: 'Username không được vượt quá 20 ký tự',
          usernameInvalid: 'Username chỉ chứa chữ, số, _, -',
          passwordMinLength: 'Mật khẩu phải có ít nhất 8 ký tự',
          passwordRequireUppercase: 'Mật khẩu phải chứa ít nhất 1 chữ hoa',
          passwordRequireNumber: 'Mật khẩu phải chứa ít nhất 1 chữ số',
          confirmPasswordRequired: 'Xác nhận mật khẩu bắt buộc',
          passwordMismatch: 'Mật khẩu xác nhận không khớp',
          firstNameRequired: 'Tên bắt buộc',
          firstNameMinLength: 'Tên phải có ít nhất 2 ký tự',
          lastNameRequired: 'Họ bắt buộc',
          lastNameMinLength: 'Họ phải có ít nhất 2 ký tự',
          phoneInvalid: 'Số điện thoại không hợp lệ'
        }
      },
      hero: {
        subheading: 'hơn',
        subheadingHighlight: 'một trăm',
        subheadingProduct: 'hương vị trà',
        mainHeading: 'Trà Đặc Biệt Chế Tác',
        description: 'Sứ mệnh của chúng tôi là mang đến cho bạn sự yên bình và kết nối thông qua các hương vị trà được chọn lọc cẩn thận và được tạo ra để nâng cao trải nghiệm hàng ngày và sức khoẻ toàn diện cho bạn.',
        ctaButton: 'Tìm Hiểu Sản Phẩm',
      },
      partner: {
        subheading: 'Có mặt tại',
        mainHeading: 'Những Nhà Phân Phối Uy Tín'
      },
      product: {
        subheading: 'Tìm hiểu',
        mainHeading: 'sản phẩm trà ngon',
        tabs: {
          specialty: 'Trà Bạc Hà',
          espresso: 'Trà Cúc',
          arabica: 'Trà Chanh Gừng',
          robusta: 'Trà Earl Grey'
        },
        featured: {
          title: 'Peppermint Velvet',
          subtitle: 'Khám phá hương vị trà tuyệt hảo từ các nông trại hàng đầu',
          description: 'Mỗi ngụm mang đến sự pha trộn hài hòa giữa hương vị đậm đà và hương thơm sảng khoái, khiến đây trở thành lựa chọn lý tưởng cho cả nghi lễ buổi sáng và giờ nghỉ giải lao buổi chiều. Trải nghiệm sự ấm áp dễ chịu và những phẩm chất tràn đầy năng lượng đã khiến trà trở thành thức uống cổ điển được yêu thích trong nhiều thế kỷ.',
          cta: 'Xem Sản Phẩm Trà'
        }
      },
      slogan: 'Chỉ những lá trà ngon nhất mới được đưa vào sản phẩm của chúng tôi, đảm bảo mỗi ngụm trà đều mang hương vị tinh khiết và tuyệt hảo.',
      features: {
        subHeading: 'Tại sao chọn chúng tôi?',
        mainHeading: 'Từ Konomi Shop',
        mainHeadingHighlight: 'Sự Độc Đáo',
        items: [
          {
            title: 'Nguồn Cung Cao Cấp',
            description: 'Chúng tôi tự hào pha chế trà đặc biệt, sử dụng lá trà chất lượng cao từ các trang trại trà tốt nhất thế giới.'
          },
          {
            title: 'Hương Vị Và Pha Chế Độc Đáo',
            description: 'Sản phẩm độc quyền của chúng tôi gồm các loại trà độc đáo được pha chế, được chế tác để làm hài lòng mọi khẩu vị.'
          },
          {
            title: 'Tập Trung Vào Sức Khỏe',
            description: 'Hãy thưởng thức các loại trà tốt cho sức khỏe của chúng tôi, được pha chế cẩn thận để hỗ trợ năng lượng, tập trung và tinh thần.'
          },
          {
            title: 'Trải Nghiệm Cá Nhân Hoá',
            description: 'Trải nghiệm dịch vụ được cá nhân hóa với mọi đơn hàng, phù hợp với sở thích và nhu cầu trà riêng của bạn.'
          },
          {
            title: 'Cam Kết Bền Vững',
            description: 'Chúng tôi cam kết bảo vệ môi trường thông qua các phương pháp nông nghiệp bền vững và bao bì thân thiện với eco.'
          }
        ]
      },
      bestSellers: {
        subheading: 'Khách hàng yêu thích',
        mainHeading: 'Những Sản Phẩm Bán Chạy Nhất',
        description: 'Khám phá những sản phẩm bán chạy nhất của chúng tôi, nơi chất lượng kết hợp hương vị trong mỗi tách trà. Hãy tham gia cùng hàng ngàn khách hàng hài lòng đã biến những pha chế này thành sở thích của họ và nâng tầm thời gian uống trà của bạn ngay hôm nay!',
        benefits: [
          'Tăng cường năng lượng và tập trung',
          'Giàu chất chống oxy hóa',
          'Tăng cường trao đổi chất',
          'Thúc đẩy sự bình tĩnh và thư giãn'
        ],
        products: [
          {
            id: 'product1',
            name: 'Peppermint Velvet',
            description: 'Mỗi ngụm mang đến sự pha trộn hài hòa giữa hương vị đậm đà và hương thơm sảng khoái, khiến đây trở thành lựa chọn lý tưởng cho cả nghi lễ buổi sáng và giờ nghỉ giải lao buổi chiều. Trải nghiệm sự ấm áp dễ chịu và những phẩm chất tràn đầy năng lượng đã khiến trà trở thành thức uống cổ điển được yêu thích trong nhiều thế kỷ.'
          },
          {
            id: 'product2',
            name: 'Chamomile Bliss',
            description: 'Mỗi ngụm mang đến sự pha trộn hài hòa giữa hương vị đậm đà và hương thơm sảng khoái, khiến đây trở thành lựa chọn lý tưởng cho cả nghi lễ buổi sáng và giờ nghỉ giải lao buổi chiều. Trải nghiệm sự ấm áp dễ chịu và những phẩm chất tràn đầy năng lượng đã khiến trà trở thành thức uống cổ điển được yêu thích trong nhiều thế kỷ.'
          },
          {
            id: 'product3',
            name: 'Lemon Ginger Zest',
            description: 'Mỗi ngụm mang đến sự pha trộn hài hòa giữa hương vị đậm đà và hương thơm sảng khoái, khiến đây trở thành lựa chọn lý tưởng cho cả nghi lễ buổi sáng và giờ nghỉ giải lao buổi chiều. Trải nghiệm sự ấm áp dễ chịu và những phẩm chất tràn đầy năng lượng đã khiến trà trở thành thức uống cổ điển được yêu thích trong nhiều thế kỷ.'
          },
          {
            id: 'product4',
            name: 'Mystic Earl Grey',
            description: 'Mỗi ngụm mang đến sự pha trộn hài hòa giữa hương vị đậm đà và hương thơm sảng khoái, khiến đây trở thành lựa chọn lý tưởng cho cả nghi lễ buổi sáng và giờ nghỉ giải lao buổi chiều. Trải nghiệm sự ấm áp dễ chịu và những phẩm chất tràn đầy năng lượng đã khiến trà trở thành thức uống cổ điển được yêu thích trong nhiều thế kỷ.'
          }
        ]
      },
      status: {
        items: [
          { label: 'Hương Vị Pha Chế', target: 100 },
          { label: 'Sản Phẩm Bán Ra Toàn Thế Giới', target: 500000 },
          { label: 'Điểm Đánh Giá Từ Khách Hàng', target: 4.9 }
        ]
      },
      story: {
        subheading: 'Khám phá',
        mainHeading: 'Câu chuyện & sứ mệnh',
        content: 'Tại Konomi Tea Station, chúng tôi tận tâm tạo ra những loại trà đặc biệt tôn vinh hương vị và sức khỏe. Có nguồn gốc từ những lá trà tốt nhất, các pha chế của chúng tôi được chế tác bằng sự chăm chút và đam mê, đảm bảo mỗi tách trà đều mang đến trải nghiệm thú vị.\nCam kết về tính bền vững và hỗ trợ cộng đồng địa phương, chúng tôi mong muốn mang đến cho bạn không chỉ là trà, mà còn là sự kết nối với thiên nhiên và truyền thống trong từng ngụm trà. Hãy cùng chúng tôi thưởng thức hành trình của trà.'
      },
      contact: {
        mainHeading: 'Có câu hỏi?',
        subheading: 'Liên hệ Konomi Tea tại',
        address: '123 Tea Lane, Quận Premium, Thành phố Espresso',
        phone: '(+0) 123 456 789',
        community: {
          title: 'Tham gia cộng đồng',
          subtitle: 'Thành Viên Konomi Tea',
          description: 'Trở thành thành viên Konomi Tea sẽ giúp bạn nhận ưu đãi độc quyền. Đăng nhập để truy cập tài khoản của bạn hoặc tạo tài khoản mới.',
          noAccount: 'Chưa có tài khoản? Đăng ký ngay!'
        }
      }
    },
    en: {
      common: {
        welcome: 'Welcome to Konomi',
        language: 'Language',
        home: 'Home',
        products: 'Products',
        cart: 'Cart',
        account: 'Account',
        logout: 'Logout',
        login: 'Sign In',
        signup: 'Sign Up',
        addToCart: 'Add to Cart',
        processing: 'Processing...'
      },
      nav: {
        home: 'Home',
        products: 'Products',
        about: 'About',
        contact: 'Contact'
      },
      footer: {
        contact: 'Contact',
        hotline: 'Hotline',
        email: 'Email',
        office: 'Office Address',
        hours: 'Business Hours',
        guide: 'Guide',
        search: 'Search',
        order: 'Order',
        payment: 'Payment',
        promotions: 'Promotions',
        shipping: 'Shipping',
        policy: 'Policy',
        fees: 'Fees',
        returns: 'Returns',
        tracking: 'Order Tracking',
        terms: 'Terms',
        termsOfUse: 'Terms of Use',
        privacy: 'Privacy Policy',
        cookies: 'Cookie Policy',
        about: 'About',
        copyright: 'Copyright © 2024 Konomi Tea. All rights reserved.'
      },
      auth: {
        signin: 'Sign In',
        signup: 'Sign Up',
        email: 'Email',
        username: 'Username',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        firstName: 'First Name',
        lastName: 'Last Name',
        phoneNumber: 'Phone Number',
        forgotPassword: 'Forgot Password?',
        rememberMe: 'Remember Me',
        noAccount: 'Don\'t have an account?',
        haveAccount: 'Already have an account?',
        signInTitle: 'Sign In to Your Account',
        signInDescription: 'Enter your credentials to continue',
        signInButton: 'Sign In',
        signUpTitle: 'Create New Account',
        signUpDescription: 'Join us to become a member',
        signUpButton: 'Sign Up',
        otpTitle: 'Verify Email',
        otpDescription: 'Enter the OTP code sent to your email',
        otpCode: 'OTP Code',
        otpVerifyButton: 'Verify',
        otpResendButton: 'Resend OTP',
        otpCodeSentTo: 'A 6-digit verification code has been sent to your email:',
        otpPlaceholder: 'Enter 6 digits',
        verifyEmailAgain: 'Verify Email Again',
        reopenOTPModal: 'Reopen OTP Modal',
        forgotPasswordTitle: 'Forgot Password?',
        forgotPasswordDescription: 'Enter your email to receive password recovery instructions',
        forgotPasswordButton: 'Send Instructions',
        resetPasswordTitle: 'Reset Password',
        resetPasswordDescription: 'Enter verification code and new password',
        resetCode: 'Verification Code',
        newPassword: 'New Password',
        confirmNewPassword: 'Confirm New Password',
        resetPasswordButton: 'Reset Password',
        backButton: 'Back',
        backToSignIn: 'Back to Sign In',
        addressOptional: 'Address (Optional)',
        billingAddress: 'Billing Address',
        deliveryAddress: 'Delivery Address',
        streetAddress: 'Street Address',
        city: 'City',
        province: 'Province/State',
        zipCode: 'Zip Code',
        country: 'Country',
        showAddress: '▶ Add Address',
        hideAddress: '▼ Hide Address',
        phoneNumberOptional: 'Phone Number (Optional)',
        validation: {
          usernameRequired: 'Username or email is required',
          passwordRequired: 'Password is required',
          emailRequired: 'Email is required',
          emailInvalid: 'Invalid email address',
          usernameMinLength: 'Username must be at least 3 characters',
          usernameMaxLength: 'Username cannot exceed 20 characters',
          usernameInvalid: 'Username can only contain letters, numbers, _, -',
          passwordMinLength: 'Password must be at least 8 characters',
          passwordRequireUppercase: 'Password must contain at least 1 uppercase letter',
          passwordRequireNumber: 'Password must contain at least 1 number',
          confirmPasswordRequired: 'Confirm password is required',
          passwordMismatch: 'Passwords do not match',
          firstNameRequired: 'First name is required',
          firstNameMinLength: 'First name must be at least 2 characters',
          lastNameRequired: 'Last name is required',
          lastNameMinLength: 'Last name must be at least 2 characters',
          phoneInvalid: 'Invalid phone number'
        }
      },
      hero: {
        subheading: 'More than',
        subheadingHighlight: 'one hundred',
        subheadingProduct: 'Tea flavors',
        mainHeading: 'Specially Crafted Tea',
        description: 'Our mission is to bring you peace and connection through carefully selected Tea flavors crafted to enhance your daily experience and overall wellness.',
        ctaButton: 'Explore Products',
      },
      partner: {
        subheading: 'Trusted by',
        mainHeading: 'Premium Tea Distributors'
      },
      product: {
        subheading: 'Discover Our',
        mainHeading: 'Premium Tea Collection',
        tabs: {
          specialty: 'Peppermint Tea',
          espresso: 'Chamomile Tea',
          arabica: 'Lemon Ginger',
          robusta: 'Earl Grey'
        },
        featured: {
          title: 'Peppermint Velvet',
          subtitle: 'Experience the exquisite taste of perfectly roasted Tea from top farms',
          description: 'Every sip brings a harmonious blend of rich flavor and invigorating aroma, making it the perfect choice for both morning rituals and afternoon breaks. Experience the comforting warmth and energizing qualities that have made Tea a beloved beverage for centuries. This specialty blend captures the essence of exceptional Tea craftsmanship.',
          cta: 'Explore Tea Collection'
        }
      },
      slogan: 'Only the finest Tea beans make it into our products, ensuring every sip delivers pure and exceptional flavor that Tea enthusiasts deserve.',
      features: {
        mainHeading: 'Why Choose Us?',
        subHeading: 'What Makes Konomi Special',
        mainHeadingHighlight: 'What Makes Konomi Special',
        items: [
          {
            title: 'Premium Sourcing',
            description: 'We proudly source specialty Tea beans from the finest Tea farms around the world, ensuring exceptional quality in every batch.'
          },
          {
            title: 'Unique Blends & Craftsmanship',
            description: 'Our exclusive Tea creations feature distinctive flavors crafted to delight every palate and elevate your Tea experience.'
          },
          {
            title: 'Health-Focused Crafting',
            description: 'Enjoy our carefully crafted Teas designed to support energy, focus, and mental clarity for a healthier lifestyle.'
          },
          {
            title: 'Personalized Experience',
            description: 'Experience personalized service with every order, tailored to your preferences and unique Tea needs.'
          },
          {
            title: 'Sustainability Commitment',
            description: 'We are dedicated to protecting the environment through sustainable farming practices and eco-friendly packaging.'
          }
        ]
      },
      bestSellers: {
        subheading: 'Customer Favorites',
        mainHeading: 'Our Best-Selling Tea Collection',
        description: 'Discover our best-selling Teas where quality meets exceptional flavor in every cup. Join thousands of satisfied customers who have made these brews their favorite go-to choice. Elevate your Tea experience today!',
        benefits: [
          'Boosts energy and focus',
          'Rich in antioxidants',
          'Enhances metabolism',
          'Promotes calm and relaxation'
        ],
        products: [
          {
            id: 'product1',
            name: 'Peppermint Velvet',
            description: 'Every sip brings a harmonious blend of rich flavor and invigorating aroma, making it the perfect choice for both morning rituals and afternoon breaks. Experience the comforting warmth and energizing qualities that have made Tea a beloved beverage for centuries.'
          },
          {
            id: 'product2',
            name: 'Chamomile Bliss',
            description: 'Every sip brings a harmonious blend of rich flavor and invigorating aroma, making it the perfect choice for both morning rituals and afternoon breaks. Experience the comforting warmth and energizing qualities that have made Tea a beloved beverage for centuries.'
          },
          {
            id: 'product3',
            name: 'Lemon Ginger Zest',
            description: 'Every sip brings a harmonious blend of rich flavor and invigorating aroma, making it the perfect choice for both morning rituals and afternoon breaks. Experience the comforting warmth and energizing qualities that have made Tea a beloved beverage for centuries.'
          },
          {
            id: 'product4',
            name: 'Mystic Earl Grey',
            description: 'Every sip brings a harmonious blend of rich flavor and invigorating aroma, making it the perfect choice for both morning rituals and afternoon breaks. Experience the comforting warmth and energizing qualities that have made Tea a beloved beverage for centuries.'
          }
        ]
      },
      status: {
        items: [
          { label: 'Unique Blends', target: 100 },
          { label: 'Tea Lovers Worldwide', target: 500000 },
          { label: 'Customer Satisfaction Rating', target: 4.9 }
        ]
      },
      story: {
        subheading: 'Discover',
        mainHeading: 'Our Story & Mission',
        content: 'At Konomi Tea Station, we are dedicated to creating exceptional Tea that honors flavor and wellness. Sourced from the finest Tea beans, our brews are crafted with meticulous care and passion, ensuring each cup delivers a delightful experience.\nCommitted to sustainability and supporting local communities, we believe in delivering not just Tea, but a connection to nature and tradition with every sip. Join us on this Tea journey.'
      },
      contact: {
        mainHeading: 'Have Questions?',
        subheading: 'Contact Konomi Tea at',
        address: '123 Tea Lane, Premium District, Espresso City',
        phone: '(+0) 123 456 789',
        community: {
          title: 'Join Our Community',
          subtitle: 'Konomi Tea Member',
          description: 'Become a Konomi Tea member for exclusive benefits and early access to new blends. Sign in to access your account or create a new one.',
          noAccount: 'No account yet? Sign up today!'
        }
      }
    },
    ja: {
      common: {
        welcome: 'コノミお茶へようこそ',
        language: '言語',
        home: 'ホーム',
        products: '製品',
        cart: 'カート',
        account: 'アカウント',
        logout: 'ログアウト',
        login: 'サインイン',
        signup: '新規登録',
        addToCart: 'カートに追加',
        processing: '処理中...'
      },
      nav: {
        home: 'ホーム',
        products: '製品',
        about: 'について',
        contact: 'お問い合わせ'
      },
      footer: {
        contact: 'お問い合わせ',
        hotline: 'ホットライン',
        email: 'メール',
        office: '事務所',
        hours: '営業時間',
        guide: 'ガイド',
        search: '検索',
        order: '注文',
        payment: '支払い',
        promotions: 'キャンペーン',
        shipping: '配送',
        policy: 'ポリシー',
        fees: '手数料',
        returns: '返品',
        tracking: '注文追跡',
        terms: '利用規約',
        termsOfUse: '利用規約',
        privacy: 'プライバシーポリシー',
        cookies: 'クッキーポリシー',
        about: '私たちについて',
        copyright: '著作権 © 2024 Konomi Tea。著作権所有。'
      },
      auth: {
        signin: 'サインイン',
        signup: '新規登録',
        email: 'メール',
        username: 'ユーザー名',
        password: 'パスワード',
        confirmPassword: 'パスワード確認',
        firstName: 'ファーストネーム',
        lastName: 'ラストネーム',
        phoneNumber: '電話番号',
        forgotPassword: 'パスワードをお忘れですか？',
        rememberMe: 'ログイン情報を保存',
        noAccount: 'アカウントをお持ちでませんか？',
        haveAccount: 'すでにアカウントをお持ちですか？',
        signInTitle: 'アカウントにサインイン',
        signInDescription: '認証情報を入力して続行してください',
        signInButton: 'サインイン',
        signUpTitle: '新規アカウント作成',
        signUpDescription: 'メンバーになるために登録してください',
        signUpButton: '新規登録',
        otpTitle: 'メール確認',
        otpDescription: 'メールに送信されたOTPコードを入力してください',
        otpCode: 'OTPコード',
        otpVerifyButton: '確認',
        otpResendButton: 'OTPを再送信',
        otpCodeSentTo: '6桁の確認コードをメールに送信しました:',
        otpPlaceholder: '6桁を入力',
        verifyEmailAgain: 'メールを再度確認',
        reopenOTPModal: 'OTPモーダルを再度開く',
        forgotPasswordTitle: 'パスワードをお忘れですか？',
        forgotPasswordDescription: 'メールアドレスを入力して、パスワード回復手順を受け取ります',
        forgotPasswordButton: '手順を送信',
        resetPasswordTitle: 'パスワードをリセット',
        resetPasswordDescription: '確認コードと新しいパスワードを入力',
        resetCode: '確認コード',
        newPassword: '新しいパスワード',
        confirmNewPassword: '新しいパスワードを確認',
        resetPasswordButton: 'パスワードをリセット',
        backButton: '戻る',
        backToSignIn: 'サインインに戻る',
        addressOptional: 'アドレス（オプション）',
        billingAddress: '請求先住所',
        deliveryAddress: '配送先住所',
        streetAddress: '街路住所',
        city: '市町村',
        province: '都道府県',
        zipCode: '郵便番号',
        country: '国',
        showAddress: '▶ アドレスを追加',
        hideAddress: '▼ アドレスを非表示',
        phoneNumberOptional: '電話番号（オプション）',
        validation: {
          usernameRequired: 'ユーザー名またはメールが必要です',
          passwordRequired: 'パスワードが必要です',
          emailRequired: 'メールが必要です',
          emailInvalid: 'メールアドレスが無効です',
          usernameMinLength: 'ユーザー名は3文字以上である必要があります',
          usernameMaxLength: 'ユーザー名は20文字以下である必要があります',
          usernameInvalid: 'ユーザー名には、文字、数字、_、-のみを含めることができます',
          passwordMinLength: 'パスワードは8文字以上である必要があります',
          passwordRequireUppercase: 'パスワードには1つ以上の大文字を含める必要があります',
          passwordRequireNumber: 'パスワードには1つ以上の数字を含める必要があります',
          confirmPasswordRequired: 'パスワード確認が必要です',
          passwordMismatch: 'パスワードが一致しません',
          firstNameRequired: 'ファーストネームが必要です',
          firstNameMinLength: 'ファーストネームは2文字以上である必要があります',
          lastNameRequired: 'ラストネームが必要です',
          lastNameMinLength: 'ラストネームは2文字以上である必要があります',
          phoneInvalid: '電話番号が無効です'
        }
      },
      hero: {
        subheading: '百以上の',
        subheadingHighlight: 'お茶の',
        subheadingProduct: '風味',
        mainHeading: '特別に調合されたお茶',
        description: '私たちの使命は、厳選されたお茶の味わいを通じて、平和とつながりをもたらし、日常体験と全体的な健康を高めるようにしています。',
        ctaButton: '製品を探索する',
      },
      partner: {
        subheading: '信頼されている',
        mainHeading: 'プレミアムお茶流通業者'
      },
      product: {
        subheading: '当社の',
        mainHeading: 'プレミアムお茶コレクションを発見',
        tabs: {
          specialty: 'ペパーミント',
          espresso: 'カモミール',
          arabica: 'レモンジンジャー',
          robusta: 'アールグレイ'
        },
        featured: {
          title: 'ペパーミントベルベット',
          subtitle: '最高のお茶農園で完璧にローストされたお茶の絶妙な味わいを体験',
          description: 'すべての一口は豊かな風味と爽快感のある香りの調和のとれた混合をもたらし、朝の儀式と午後の休憩の両方に最適な選択をします。何世紀にもわたってお茶を愛するようにした心地よい温かさと活力溢れる品質を体験してください。このスペシャルティブレンドは、例外的なお茶職人技の本質を捉えています。',
          cta: 'お茶コレクションを探索'
        }
      },
      slogan: '最高品質のお茶豆のみが当社の製品に入選され、すべての一口がお茶愛好家にふさわしい純粋で例外的な味わいをもたらします。',
      features: {
        mainHeading: 'なぜ私たちを選ぶのか？',
        subHeading: 'コノミが特別な理由',
        mainHeadingHighlight: 'コノミが特別な理由',
        items: [
          {
            title: 'プレミアム調達',
            description: '世界中の最高のお茶農園からスペシャルティお茶豆を誇りを持って調達し、各バッチで優れた品質を保証します。'
          },
          {
            title: 'ユニークなブレンドと職人技',
            description: '当社の独占的なお茶創作は、すべての味覚を喜ばせ、お茶体験を高めるために作られた特徴的な風味を備えています。'
          },
          {
            title: '健康に焦点を当てたクラフティング',
            description: 'エネルギー、集中力、精神的明晰さをサポートするために設計された慎重に作られたお茶をお楽しみください。'
          },
          {
            title: 'パーソナライズされた体験',
            description: '各注文でパーソナライズされたサービスを体験し、あなたの好みとユニークなお茶ニーズに合わせてカスタマイズされています。'
          },
          {
            title: '持続可能性への取り組み',
            description: '持続可能な農業慣行と環境に優しいパッケージを通じて、環境を保護することに専念しています。'
          }
        ]
      },
      bestSellers: {
        subheading: 'お客様のお気に入り',
        mainHeading: '当社のベストセラーお茶コレクション',
        description: '品質が例外的な風味とすべてのカップで出会うベストセラーお茶を発見してください。これらの淹れたてをお気に入りの選択肢にした満足を受けた何千人ものお客様に参加してください。今日、あなたのお茶体験を高めてください！',
        benefits: [
          'エネルギーと集中力を高める',
          '抗酸化物質が豊富',
          '代謝を向上',
          '落ち着きとリラックスを促進'
        ],
        products: [
          {
            id: 'product1',
            name: 'ペパーミントベルベット',
            description: 'すべての一口は豊かな風味と爽快感のある香りの調和のとれた混合をもたらし、朝の儀式と午後の休憩の両方に最適な選択をします。何世紀にもわたってお茶を愛するようにした心地よい温かさと活力溢れる品質を体験してください。'
          },
          {
            id: 'product2',
            name: 'カモミールブリス',
            description: 'すべての一口は豊かな風味と爽快感のある香りの調和のとれた混合をもたらし、朝の儀式と午後の休憩の両方に最適な選択をします。何世紀にもわたってお茶を愛するようにした心地よい温かさと活力溢れる品質を体験してください。'
          },
          {
            id: 'product3',
            name: 'レモンジンジャーゼスト',
            description: 'すべての一口は豊かな風味と爽快感のある香りの調和のとれた混合をもたらし、朝の儀式と午後の休憩の両方に最適な選択をします。何世紀にもわたってお茶を愛するようにした心地よい温かさと活力溢れる品質を体験してください。'
          },
          {
            id: 'product4',
            name: 'ミスティックアールグレイ',
            description: 'すべての一口は豊かな風味と爽快感のある香りの調和のとれた混合をもたらし、朝の儀式と午後の休憩の両方に最適な選択をします。何世紀にもわたってお茶を愛するようにした心地よい温かさと活力溢れる品質を体験してください。'
          }
        ]
      },
      status: {
        items: [
          { label: 'ユニークなブレンド', target: 100 },
          { label: '世界中のお茶愛好家', target: 500000 },
          { label: 'お客様満足度評価', target: 4.9 }
        ]
      },
      story: {
        subheading: '発見',
        mainHeading: '当社のストーリーと使命',
        content: 'コノミお茶ステーションでは、風味と健康を尊重する例外的なお茶を作ることに専念しています。最高のお茶豆から調達した当社のお茶は、細心の注意と情熱を持って作られ、すべてのカップが喜びの体験をもたらすことを保証します。\n持続可能性と地域社会の支援にコミットしている当社は、単なるお茶ではなく、すべての一口で自然と伝統とのつながりをもたらすことを信じています。このお茶の旅に参加してください。'
      },
      contact: {
        mainHeading: 'ご質問はありますか？',
        subheading: 'コノミお茶にお問い合わせください',
        address: '123 Tea Lane、プレミアム地区、エスプレッソ市',
        phone: '(+0) 123 456 789',
        community: {
          title: 'コミュニティに参加',
          subtitle: 'コノミお茶メンバー',
          description: 'コノミお茶メンバーになると、独占的な特典と新しいブレンドへの早期アクセスが得られます。サインインしてアカウントにアクセスするか、新しいアカウントを作成してください。',
          noAccount: 'アカウントをお持ちでないですか？今すぐサインアップ！'
        }
      }
    },
    de: {
      common: {
        welcome: 'Willkommen bei Konomi',
        language: 'Sprache',
        home: 'Startseite',
        products: 'Produkte',
        cart: 'Warenkorb',
        account: 'Konto',
        logout: 'Abmelden',
        login: 'Anmelden',
        signup: 'Registrieren',
        addToCart: 'In den Warenkorb',
        processing: 'Wird bearbeitet...'
      },
      nav: {
        home: 'Startseite',
        products: 'Produkte',
        about: 'Über',
        contact: 'Kontakt'
      },
      footer: {
        contact: 'Kontakt',
        hotline: 'Hotline',
        email: 'E-Mail',
        office: 'Büro',
        hours: 'Geschäftszeiten',
        guide: 'Anleitung',
        search: 'Suchen',
        order: 'Bestellen',
        payment: 'Zahlung',
        promotions: 'Promotionen',
        shipping: 'Versand',
        policy: 'Richtlinie',
        fees: 'Gebühren',
        returns: 'Rückgaben',
        tracking: 'Bestellverfolgung',
        terms: 'Bedingungen',
        termsOfUse: 'Nutzungsbedingungen',
        privacy: 'Datenschutzrichtlinie',
        cookies: 'Cookie-Richtlinie',
        about: 'Über uns',
        copyright: 'Copyright © 2024 Konomi Tea. Alle Rechte vorbehalten.'
      },
      auth: {
        signin: 'Anmelden',
        signup: 'Registrieren',
        email: 'E-Mail',
        username: 'Benutzername',
        password: 'Passwort',
        confirmPassword: 'Passwort bestätigen',
        firstName: 'Vorname',
        lastName: 'Nachname',
        phoneNumber: 'Telefonnummer',
        forgotPassword: 'Passwort vergessen?',
        rememberMe: 'Anmeldedaten speichern',
        noAccount: 'Kein Konto vorhanden?',
        haveAccount: 'Haben Sie bereits ein Konto?',
        signInTitle: 'Melden Sie sich bei Ihrem Konto an',
        signInDescription: 'Geben Sie Ihre Anmeldedaten ein, um fortzufahren',
        signInButton: 'Anmelden',
        signUpTitle: 'Neues Konto erstellen',
        signUpDescription: 'Registrieren Sie sich, um Mitglied zu werden',
        signUpButton: 'Registrieren',
        otpTitle: 'E-Mail verifizieren',
        otpDescription: 'Geben Sie den OTP-Code ein, der an Ihre E-Mail gesendet wurde',
        otpCode: 'OTP-Code',
        otpVerifyButton: 'Verifizieren',
        otpResendButton: 'OTP erneut senden',
        otpCodeSentTo: 'Ein 6-stelliger Bestätigungscode wurde an Ihre E-Mail gesendet:',
        otpPlaceholder: '6 Ziffern eingeben',
        verifyEmailAgain: 'E-Mail erneut verifizieren',
        reopenOTPModal: 'OTP-Modal erneut öffnen',
        forgotPasswordTitle: 'Passwort vergessen?',
        forgotPasswordDescription: 'Geben Sie Ihre E-Mail ein, um Anweisungen zur Passwortwiederherstellung zu erhalten',
        forgotPasswordButton: 'Anweisungen senden',
        resetPasswordTitle: 'Passwort zurücksetzen',
        resetPasswordDescription: 'Geben Sie Bestätigungscode und neues Passwort ein',
        resetCode: 'Bestätigungscode',
        newPassword: 'Neues Passwort',
        confirmNewPassword: 'Neues Passwort bestätigen',
        resetPasswordButton: 'Passwort zurücksetzen',
        backButton: 'Zurück',
        backToSignIn: 'Zurück zum Anmelden',
        addressOptional: 'Adresse (optional)',
        billingAddress: 'Rechnungsadresse',
        deliveryAddress: 'Lieferadresse',
        streetAddress: 'Straßenaddresse',
        city: 'Stadt',
        province: 'Provinz/Staat',
        zipCode: 'Postleitzahl',
        country: 'Land',
        showAddress: '▶ Adresse hinzufügen',
        hideAddress: '▼ Adresse ausblenden',
        phoneNumberOptional: 'Telefonnummer (optional)',
        validation: {
          usernameRequired: 'Benutzername oder E-Mail erforderlich',
          passwordRequired: 'Passwort erforderlich',
          emailRequired: 'E-Mail erforderlich',
          emailInvalid: 'Ungültige E-Mail-Adresse',
          usernameMinLength: 'Benutzername muss mindestens 3 Zeichen lang sein',
          usernameMaxLength: 'Benutzername darf 20 Zeichen nicht überschreiten',
          usernameInvalid: 'Benutzername darf nur Buchstaben, Zahlen, _, - enthalten',
          passwordMinLength: 'Passwort muss mindestens 8 Zeichen lang sein',
          passwordRequireUppercase: 'Passwort muss mindestens 1 Großbuchstaben enthalten',
          passwordRequireNumber: 'Passwort muss mindestens 1 Ziffer enthalten',
          confirmPasswordRequired: 'Passwortbestätigung erforderlich',
          passwordMismatch: 'Passwörter stimmen nicht überein',
          firstNameRequired: 'Vorname erforderlich',
          firstNameMinLength: 'Vorname muss mindestens 2 Zeichen lang sein',
          lastNameRequired: 'Nachname erforderlich',
          lastNameMinLength: 'Nachname muss mindestens 2 Zeichen lang sein',
          phoneInvalid: 'Ungültige Telefonnummer'
        }
      },
      hero: {
        subheading: 'Über',
        subheadingHighlight: 'hundert',
        subheadingProduct: 'Teeblends',
        mainHeading: 'Speziell zubereiteter Tee',
        description: 'Unsere Mission ist es, Ihnen Frieden und Verbindung durch sorgfältig ausgewählte Teearomen zu bringen, die entwickelt wurden, um Ihre tägliche Erfahrung und Ihre Gesamtgesundheit zu verbessern.',
        ctaButton: 'Produkte erkunden',
      },
      partner: {
        subheading: 'Vertraut von',
        mainHeading: 'Premium-Teeverteiler'
      },
      product: {
        subheading: 'Entdecken Sie unsere',
        mainHeading: 'Premium-Teekollektion',
        tabs: {
          specialty: 'Pfefferminz',
          espresso: 'Kamille',
          arabica: 'Zitronenginger',
          robusta: 'Earl Grey'
        },
        featured: {
          title: 'Pfefferminz-Samt',
          subtitle: 'Erleben Sie den exquisiten Geschmack von perfekt zubereiteter Tee von Top-Farmen',
          description: 'Jeder Schluck bringt eine harmonische Mischung aus reichhaltigem Aroma und belebender Duftnote, was ihn zur perfekten Wahl sowohl für morgendliche Rituale als auch für Nachmittagspausen macht. Erleben Sie die beruhigende Wärme und belebenden Eigenschaften, die den Tee zu einem geliebten Getränk über Jahrhunderte hinweg gemacht haben. Diese Spezialmischung erfasst das Wesen der außergewöhnlichen Teekunst.',
          cta: 'Teekollektion erkunden'
        }
      },
      slogan: 'Nur die besten Teeblätter gelangen in unsere Produkte und sorgen dafür, dass jeder Schluck einen reinen und außergewöhnlichen Geschmack liefert, den Teeliebhaber verdienen.',
      features: {
        mainHeading: 'Warum uns wählen?',
        subHeading: 'Was Konomi besonders macht',
        mainHeadingHighlight: 'Was Konomi besonders macht',
        items: [
          {
            title: 'Premium-Beschaffung',
            description: 'Wir beschaffen stolz Spezialteeblätter von den besten Teegütern der Welt und stellen dabei in jeder Charge außergewöhnliche Qualität sicher.'
          },
          {
            title: 'Einzigartige Mischungen und Kunstfertigkeit',
            description: 'Unsere exklusiven Teekreationen zeichnen sich durch unverwechselbare Aromen aus, die jeden Gaumen erfreuen und Ihr Teeerlebnis verbessern.'
          },
          {
            title: 'Gesundheitsorientierte Herstellung',
            description: 'Genießen Sie unsere sorgfältig zubereitete Tees, die entwickelt wurden, um Energie, Konzentration und mentale Klarheit zu unterstützen.'
          },
          {
            title: 'Personalisiertes Erlebnis',
            description: 'Erleben Sie personalisierten Service bei jeder Bestellung, zugeschnitten auf Ihre Vorlieben und einzigartigen Teebedürfnisse.'
          },
          {
            title: 'Nachhaltigkeitsverpflichtung',
            description: 'Wir engagieren uns für den Umweltschutz durch nachhaltige Anbaumethoden und umweltfreundliche Verpackung.'
          }
        ]
      },
      bestSellers: {
        subheading: 'Kundenlieblinge',
        mainHeading: 'Unsere meistverkaufte Teekollektion',
        description: 'Entdecken Sie unsere meistverkauften Tees, bei denen Qualität in jeder Tasse außergewöhnlichen Geschmack trifft. Treten Sie tausenden zufriedenen Kunden bei, die diese Brühe zu ihrer Lieblingsauswahl gemacht haben. Heben Sie Ihr Teeerlebnis heute!',
        benefits: [
          'Steigert Energie und Konzentration',
          'Reich an Antioxidantien',
          'Verbessert den Stoffwechsel',
          'Fördert Ruhe und Entspannung'
        ],
        products: [
          {
            id: 'product1',
            name: 'Pfefferminz-Samt',
            description: 'Jeder Schluck bringt eine harmonische Mischung aus reichhaltigem Aroma und belebender Duftnote, was ihn zur perfekten Wahl sowohl für morgendliche Rituale als auch für Nachmittagspausen macht. Erleben Sie die beruhigende Wärme und belebenden Eigenschaften, die den Tee zu einem geliebten Getränk über Jahrhunderte hinweg gemacht haben.'
          },
          {
            id: 'product2',
            name: 'Kamille-Glückseligkeit',
            description: 'Jeder Schluck bringt eine harmonische Mischung aus reichhaltigem Aroma und belebender Duftnote, was ihn zur perfekten Wahl sowohl für morgendliche Rituale als auch für Nachmittagspausen macht. Erleben Sie die beruhigende Wärme und belebenden Eigenschaften, die den Tee zu einem geliebten Getränk über Jahrhunderte hinweg gemacht haben.'
          },
          {
            id: 'product3',
            name: 'Zitronenginger-Schwung',
            description: 'Jeder Schluck bringt eine harmonische Mischung aus reichhaltigem Aroma und belebender Duftnote, was ihn zur perfekten Wahl sowohl für morgendliche Rituale als auch für Nachmittagspausen macht. Erleben Sie die beruhigende Wärme und belebenden Eigenschaften, die den Tee zu einem geliebten Getränk über Jahrhunderte hinweg gemacht haben.'
          },
          {
            id: 'product4',
            name: 'Mystischer Earl Grey',
            description: 'Jeder Schluck bringt eine harmonische Mischung aus reichhaltigem Aroma und belebender Duftnote, was ihn zur perfekten Wahl sowohl für morgendliche Rituale als auch für Nachmittagspausen macht. Erleben Sie die beruhigende Wärme und belebenden Eigenschaften, die den Tee zu einem geliebten Getränk über Jahrhunderte hinweg gemacht haben.'
          }
        ]
      },
      status: {
        items: [
          { label: 'Einzigartige Mischungen', target: 100 },
          { label: 'Kaffeeliebhaber weltweit', target: 500000 },
          { label: 'Kundenzufriedenheitsbewertung', target: 4.9 }
        ]
      },
      story: {
        subheading: 'Entdecken',
        mainHeading: 'Unsere Geschichte und Mission',
        content: 'Bei Konomi Tea Station widmen wir uns der Schaffung außergewöhnlicher Tee, der Geschmack und Wellness würdigt. Aus den besten Teeblättern beschafft, werden unsere Brühe mit großer Sorgfalt und Leidenschaft hergestellt und stellen dabei sicher, dass jede Tasse eine köstliche Erfahrung liefert.\nDem Engagement für Nachhaltigkeit und der Unterstützung lokaler Gemeinden verpflichtet, glauben wir daran, mit jedem Schluck nicht nur Tee, sondern eine Verbindung mit Natur und Tradition zu liefern. Begleiten Sie uns auf dieser Tee-Reise.'
      },
      contact: {
        mainHeading: 'Haben Sie Fragen?',
        subheading: 'Kontaktieren Sie Konomi Tea unter',
        address: '123 Tea Lane, Premiumviertel, Espresso-Stadt',
        phone: '(+0) 123 456 789',
        community: {
          title: 'Treten Sie unserer Gemeinschaft bei',
          subtitle: 'Konomi Tea Mitglied',
          description: 'Werden Sie Konomi Tea Mitglied für exklusive Vorteile und frühzeitigen Zugriff auf neue Mischungen. Melden Sie sich an, um auf Ihr Konto zuzugreifen, oder erstellen Sie ein neues Konto.',
          noAccount: 'Noch kein Konto? Registrieren Sie sich noch heute!'
        }
      }
    }
  },
}))
