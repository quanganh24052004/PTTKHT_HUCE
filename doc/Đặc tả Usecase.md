1. **Đặc tả UC Tra cứu món ăn trực tuyến**

| **Name** | Tra cứu món ăn trực tuyến | **Code** | UC\_01 |
| **Description** | Người dùng truy cập website để tra cứu toàn bộ món ăn của nhà hàng. |
| **Actor** | Người duyệt web. | **Trigger** | Người duyệt web truy cập vào website của nhà hàng và chọn mục "Thực đơn". |
| **Priority** | Medium |
| **Pre\_Condition** | Thiết bị của người dùng có kết nối internet |
| **Post\_Condition** | Danh sách các món ăn tương ứng với tiêu chí lọc/tìm kiếm hiển thị trên màn hình |
| **Error situation** | Không tải được dữ liệu từ máy chủ; lỗi hiển thị hình ảnh món ăn. |
| **System state in error situation** | Hiển thị thông báo: "Hệ thống đang bảo trì. Vui lòng thử lại sau." |
| **Activites Flow** |
| **Main Flow** |  |
| **Actor** | **System** |
| 1\. Nhập URL trang web của nhà hàng và truy cập trang chủ 3\. Chọn vào mục "Thực đơn" trên thanh công cụ bên cạnh 6\. Nhấp chọn một danh mục cụ thể 7\. Lướt xem danh sách các món ăn | 2\. Tải giao diện trang chủ 4\. Hệ thống truy xuất CSDL 5\. Hiển thị các món ăn trong menu Món lẩu 7\. Hệ thống truy xuất và hiển thị danh sách các món ăn tương ứng với danh mục được chọn. |
| **Alternative Flow** | 3a. Người dùng muốn tìm kiếm nhanh món ăn bằng tên |
| **Actor** | **System** |
| 3a1. Người duyệt web nhập từ khóa tên món vào thanh tìm kiếm 3a3. UC tiếp tục bước 7 | 3a2. Hệ thống thực hiện truy vấn và hiển thị danh sách các món ăn có tên khớp với từ khóa. |
| **Alternative Flow** | 7a. Xem chi tiết món ăn |
| **Actor** | **System** |
| 7a1. Người dùng ấn chọn vào một món ăn cụ thể. 7a3. Người dùng khi xem xong chi tiết món ăn ấn nút “Đóng”. | 7a2. Popup hiện lên hiển thị chi tiết của món đó. 7a4. Hệ thống trở về màn hình Thực đơn trước đó |
| **Exception Flow** | 3b. Không tìm thấy kết quả tìm kiếm theo tên món |
| **Actor** | **System** |
| 3b3. Người duyệt web xóa từ khóa và nhập lại từ khóa khác. | 3b1. Hệ thống thực hiện truy vấn CSDL và phát hiện không có món ăn nào khớp với từ khóa 3b2. Hệ thống hiển thị thông báo “Không tìm thấy món ăn trong thực đơn” |
| **Non\_Functional Requirement** |  |
| **NFR01.1** | Hệ thống phải phản hồi kết quả lọc món trong vòng 2 giây. |
| **NFR01.2** | Giao diện hiển thị thực đơn phải thân thiện, dễ nhìn |
| **System Message** |  |
| **MS01.1** | "Không tìm thấy món ăn trong thực đơn" |
| **MS01.2** | "Hệ thống đang bảo trì. Vui lòng thử lại sau." |
| **Bussiness Rules** |  |
| **BR01.1** | Website phải hiển thị tất cả các món ăn có trong CSDL tổng của nhà hàng |

1. **Đặc tả UC Xem thông tin chung của nhà hàng**

| **Name** | Xem thông tin chung của nhà hàng | **Code** | UC\_02 |
| **Description** | Người duyệt web truy cập website để xem giao diện chính, quảng cáo, câu chuyện thương hiệu của nhà hàng và thông tin của các chi nhánh. |
| **Actor** | Người duyệt web. | **Trigger** | Người dùng nhập URL truy cập vào website của nhà hàng. |
| **Priority** | Low |
| **Pre\_Condition** | Thiết bị của người dùng có kết nối internet |
| **Post\_Condition** | Các thông tin chung của nhà hàng được tải và hiển thị thành công. |
| **Error situation** | Không tải được dữ liệu từ máy chủ |
| **System state in error situation** | Hiển thị thông báo: "Hệ thống đang bảo trì. Vui lòng thử lại sau." |
| **Activites Flow** |
| **Main Flow** |  |
| **Actor** | **System** |
| 1\. Nhập URL và truy cập trang web nhà hàng. 3\. Lướt xem các thông tin hiển thị trên trang chủ. | 2\. Tải giao diện trang chủ của nhà hàng, hiển thị các thanh menu bên cạnh và các thông tin quảng cáo. |
| **Alternative Flow** | 3a. Xem thông tin Chi nhánh |
| **Actor** | **System** |
| 3a1. Nhấn chọn mục “Chi nhánh” trên thanh điều hướng 3a4. Nhấn chọn vào một chi nhánh cụ thể 3a6. Xem xong, nhấn nút "X" | 3a2. Hệ thống truy xuất CSDL 3a3. Màn hình hiển thị danh sách các chi nhánh và thông tin của chi nhánh có mặt tại Việt Nam. 3a5. Hệ thống hiển thị popup là địa chỉ của chi nhánh trên bản đồ. 3a7. Trở lại màn hình “Chi nhánh” ban đầu |
| **Alternative Flow** | 3b. Xem thông tin Giới thiệu thương hiệu |
| **Actor** | **System** |
| 3b1. Nhấn chọn mục "Về HaceLao" trên thanh điều hướng bên cạnh. 3b3. Khi đọc xong, người dùng có thể chọn tab khác để tiếp tục lướt web. | 3b2. Hệ thống hiển thị trang nội dung giới thiệu chung về nhà hàng thương hiệu. |
| **Non\_Functional Requirement** |  |
| **NFR02.1** | Hình ảnh quảng cáo ở trang chủ và thông tin chi nhánh phải được tải đầy đủ trong tối đa 3 giây. |
| **System Message** |  |
| **MS02.2** | "Hệ thống đang bảo trì. Vui lòng thử lại sau." |
| **Bussiness Rules** |  |
| **BR02.1** | Dữ liệu hiển thị tại tab "Chi nhánh" bắt buộc phải truy xuất từ bảng ChiNhanh trong CSDL. |

1. **Đặc tả UC Đăng nhập**

| **Name** | Đăng nhập | **Code** | UC\_03 |
| **Description** | Nhân viên nhà hàng xác thực danh tính để vào giao diện làm việc tương ứng với vai trò. |
| **Actor** | Đầu bếp, Thu ngân | **Trigger** | Nhân viên truy cập website nhà hàng và chọn đăng nhập. |
| **Priority** | Must Have |
| **Pre\_Condition** | Tài khoản nhân viên đã được cấp bởi quản trị viên hệ thống và lưu trong CSDL |
| **Post\_Condition** | Nhân viên được điều hướng vào màn hình làm việc đúng với chức năng của mình |
| **Error situation** | Hệ thống xác thực bị sập Mất kết nối CSDL |
| **System state in error situation** | Hệ thống đăng nhập đang bảo trì |
| **Activites Flow** |
| **Main Flow** |  |
| **Actor** | **System** |
| 1\. Nhân viên truy cập vào website của nhà hàng và chọn nút Đăng nhập 3\. Nhân viên nhập Tên đăng nhập và Mật khẩu, ấn "Đăng nhập" | 2\. Hệ thống hiển thị Form đăng nhập 4\. Hệ thống mã hóa mật khẩu 5\. Hệ thống kiểm tra trạng thái tài khoản. 6\. Hệ thống đối chiếu thông tin và vai trò trong CSDL. 7\. Hệ thống điều hướng màn hình: Nếu là Đầu bếp thì mở giao diện “Quản lý thực đơn”; Nếu là Thu ngân thì mở giao diện “Sơ đồ bàn” |
| **Exception Flow** | 4a. Nhân viên nhập sai thông tin đăng nhập (chưa quá 5 lần nhập sai) |
| **Actor** | **System** |
| 4a3. Nhân viên nhập lại mật khẩu và ấn Đăng nhập | 4a1. Hệ thống ghi nhận số lần đăng nhập sai. 4a2.1. Nếu số lần sai chưa quá 5 lần. Hệ thống hiển thị thông báo lỗi "Tài khoản hoặc mật khẩu không chính xác. Vui lòng thử lại." và giữ nguyên màn hình đăng nhập. 4a4. UC tiếp tục bước 4 4a2.2. Nếu số lần sai liên tiếp đạt 5 lần: Hệ thống tự động cập nhật trạng thái tài khoản thành "Khóa tạm thời" và hiển thị thông báo “Tài khoản hiện đang bị khóa tạm thời do nhập sai quá nhiều lần”. |
| **Exception Flow** | 5a. Tài khoản đang trong trạng thái bị khóa |
| **Actor** | **System** |
|  | 5a1. Hệ thống phát hiện trạng thái tài khoản là "Khóa tạm thời". 5a2. Hệ thống hiển thị thông báo "Tài khoản hiện đang bị khóa tạm thời”. 5a3. Kết thúc Use Case. |
| **Non\_Functional Requirement** |  |
| **NFR03.1** | Mật khẩu của nhân viên phải được mã hóa trước khi đối chiếu với CSDL. |
| **NFR03.2** | Thời gian phản hồi xác thực đăng nhập không được vượt quá 2 giây. |
| **System Message** |  |
| **MS03.1** | "Tài khoản hoặc mật khẩu không chính xác. Vui lòng thử lại." |
| **MS03.2** | “Tài khoản hiện đang bị khóa tạm thời do nhập sai quá nhiều lần.” |
| **MS03.3** | "Tài khoản hiện đang bị khóa tạm thời”. |
| **Bussiness Rules** |  |
| **BR03.1** | Nếu nhập sai mật khẩu quá 5 lần liên tiếp, tài khoản sẽ bị tạm khóa |
| **BR03.2** | Mật khẩu phải có ít nhất 8 ký tự, bao gồm ít nhất 1 chữ hoa, 1 chữ thường và 1 chữ số. |
| **BR03.3** | Tài khoản thuộc vai trò nào chỉ được phép truy cập vào chức năng và giao diện của vai trò đó. |

1. **Đặc tả UC Đăng xuất**

| **Name** | Đăng xuất | **Code** | UC\_04 |
| **Description** | Nhân viên kết thúc ca làm việc và đăng xuất khỏi hệ thống để bảo mật tài khoản. |
| **Actor** | Đầu bếp, Thu ngân | **Trigger** | Nhân viên nhấn vào nút "Đăng xuất" trên giao diện làm việc. |
| **Priority** | High |
| **Pre\_Condition** | Nhân viên đang trong trạng thái đã đăng nhập vào hệ thống. |
| **Post\_Condition** | Hệ thống hủy phiên làm việc hiện tại và điều hướng người dùng về màn hình đăng nhập. |
| **Error situation** | Hệ thống gặp lỗi mạng hoặc treo trình duyệt khi đang xử lý hủy phiên làm việc. |
| **System state in error situation** | Hiển thị thông báo "Lỗi kết nối, không thể đăng xuất lúc này." và giữ nguyên trạng thái đăng nhập. |
| **Activites Flow** |
| **Main Flow** |  |
| **Actor** | **System** |
| 1.  Nhân viên ấn vào nút Menu tài khoản trên giao diện làm việc. 3\. Nhân viên nhấn chọn nút "Đăng xuất". | 2\. Hệ thống hiển thị popup xác nhận: "Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?" 4\. Hệ thống tiếp nhận yêu cầu, tiến hành xóa thông tin phiên làm việc hiện tại. 5\. Hệ thống đóng giao diện làm việc (của Thu ngân/Đầu bếp) và tự động điều hướng về màn hình Đăng nhập |
| **Alternative Flow** | 3a. Hủy thao tác đăng xuất |
| **Actor** | **System** |
| 3a1. Tại hộp thoại xác nhận, nhân viên nhấn chọn "X". | 3a2. Hệ thống đóng hộp thoại xác nhận và giữ nguyên giao diện làm việc hiện tại. |
| **Non\_Functional Requirement** |  |
| **NFR04.1** | Thời gian xử lý xóa phiên làm việc và chuyển trang không được vượt quá 3 giây. |
| **System Message** |  |
| **MS04.1** | "Lỗi kết nối, không thể đăng xuất lúc này." |
| **MS04.2** | "Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?" |
| **Bussiness Rules** |  |
| **BR04.1** | Khi đăng xuất thành công, nếu nhân viên muốn quay lại trang cũ, hệ thống sẽ yêu cầu đăng nhập lại. |

1. **Đặc tả UC Duyệt menu**

| **Name** | Duyệt menu | **Code** | UC\_05 |
| **Description** | Thực khách lướt xem danh sách thực đơn đang phục vụ trong ngày tại chi nhánh. |
| **Actor** | Thực khách | **Trigger** | Thực khách chạm vào màn hình Tablet tại bàn. |
| **Priority** | High |
| **Pre\_Condition** | Tablet tại bàn đã được khởi động, hiển thị số bàn, thanh tìm kiếm món ăn, đơn đặt, và giỏ hàng. Có kết nối mạng tới máy chủ. |
| **Post\_Condition** | Danh sách món ăn được hiển thị đúng với thực đơn trong ngày mà đầu bếp đã tạo. |
| **Error situation** | Mất kết nối mạng Lỗi truy vấn cơ sở dữ liệu |
| **System state in error situation** | Hệ thống giữ nguyên giao diện hiện tại, đóng băng các thao tác chọn món và hiển thị cảnh báo chờ kết nối lại. |
| **Activites Flow** |
| **Main Flow** |  |
| **Actor** | **System** |
| 1\. Thực khách chọn vào một danh mục để lọc món ăn 4\. Thực khách lướt xem các món ăn. | 2\. Hệ thống truy xuất CSDL, lọc các món thuộc danh mục đã chọn đang được phục vụ tại chi nhánh. 3\. Hệ thống hiển thị danh sách gồm: Hình ảnh, Tên món, Giá tiền và Trạng thái. |
| **Alternative Flow** | 1a. Tìm kiếm món ăn bằng từ khóa |
| **Actor** | **System** |
| 1a1. Thực khách chọn vào thanh tìm kiếm và nhập tên món ăn. UC tiếp tục luồng chính tại Bước 4. | 1a2. Hệ thống truy xuất CSDL và trả về danh sách món khớp từ khóa. |
| **Alternative Flow** | 4a. Xem chi tiết món ăn |
| **Actor** | **System** |
| 4a1. Thực khách ấn chọn vào 1 món ăn cụ thể 4a3. Khi xem xong, khách chọn nút Đóng trên popup. | 4a2. Hệ thống hiển thị popup chi tiết món ăn đó. 4a4. Trở lại màn hình các món ăn ban đầu |
| **Exception Flow** | 1b. Không tìm thấy món ăn theo từ khóa |
| **Actor** | **System** |
| 3b3. Thực khách xóa từ khóa và nhập lại từ khóa mới. | 3b1. Hệ thống thực hiện truy vấn CSDL và phát hiện không có món ăn nào khớp với từ khóa. 3b2. Hệ thống hiển thị thông báo “Không tìm thấy món ăn trong thực đơn” |
| **Exception Flow** | 2a. Lỗi mất kết nối máy chủ khi tải dữ liệu |
| **Actor** | **System** |
| 2a3. Thực khách ấn nút "Thử lại". | 2a1. Hệ thống không thể tải dữ liệu thực đơn từ CSDL. 2a2. Hệ thống hiển thị thông báo lỗi "Mất kết nối đến máy chủ"và hiện nút "Thử lại". 2a4. Hệ thống thực hiện kết nối lại. Nếu thành công, UC quay về Bước 2. Nếu thất bại, lặp lại Bước 2a2. |
| **Non\_Functional Requirement** |  |
| **NFR05.1** | Thời gian phản hồi tải danh sách món ăn hoặc kết quả tìm kiếm không được vượt quá 2 giây. |
| **System Message** |  |
| **MS05.1** | "Mất kết nối đến máy chủ" |
| **MS05.2** | "Không tìm thấy món ăn trong thực đơn" |
| **Bussiness Rules** |  |
| **BR05.1** | Danh sách hiển thị bắt buộc phải là các món ăn có trong thực đơn ngày hôm đó của chi nhánh. |

1. **Đặc tả UC Xem order**

| **Name** | Xem order | **Code** | UC\_06 |
| **Description** | Thực khách kiểm tra danh sách các món ăn đã thêm vào order và có thể cập nhật order |
| **Actor** | Thực khách | **Trigger** | Thực khách chọn vào biểu tượng "Giỏ hàng" trên Tablet. |
| **Priority** | Must Have |
| **Pre\_Condition** | Tablet tại bàn đã được kích hoạt và đang ở giao diện Duyệt menu. |
| **Post\_Condition** | Thực khách nắm rõ tổng số tiền order của mình |
| **Error situation** | Mất kết nối mạng |
| **Activites Flow** |
| **Main Flow** |  |
| **Actor** | **System** |
| 1\. Thực khách chọn vào biểu tượng “Giỏ hàng” 4\. Thực khách nhấn "Đóng" | 2\. Hệ thống truy xuất dữ liệu từ bộ nhớ tạm cho món đã thêm vào order và chưa gửi xuống bếp 3\. Hệ thống hiển thị danh sách chi tiết gồm: tên món, cập nhật số lượng, đơn giá và biểu tượng xóa món và tổng tiền tạm tính của order. 5\. Hệ thống quay lại giao diện thực đơn của chi nhánh nhà hàng. |
| **Alternative Flow** | 4a. Cập nhật số lượng món ăn |
| **Actor** | **System** |
| 4a1. Thực khách thao tác trên giỏ hàng: \- Bấm nút \[+\] hoặc \[-\] để Cập nhật số lượng. UC quay lại bước 4 | 4a2. Hệ thống cập nhật lại só lượng món ăn. 4a3. Hệ thống thực hiện: Tính toán lại thành tiền của món và cập nhật tổng tiền tạm tính của order. |
| **Alternative Flow** | 4b. Xóa món |
| **Actor** | **System** |
| 4b1. Thực khách chọn vào biểu tượng thùng rác trong giỏ hàng tương ứng với từng món ăn UC quay lại bước 4 | 4b2. Màn hình giỏ hàng không còn hiển thị món ăn mà thực khách đã xóa 4b3. Hệ thống thực hiện: Tính toán lại thành tiền của món và cập nhật tổng tiền tạm tính của order. |
| **Alternative Flow** | 4c. Thêm món |
| **Actor** | **System** |
| 4c1. Thực khách ấn nút “Đóng” ở giao diện giỏ hàng. 4c3. Thực hiện UC Tạo order | 4c2. Hệ thống hiển thị màn hình chính danh sách thực đơn của chi nhánh |
| **Exception Flow** | 3b. Order trống chưa được thêm món |
| **Actor** | **System** |
|  | 3b1. Hệ thống hiển thị thông báo “Order đang trống. Vui lòng thêm món ăn” |
| **Non\_Functional Requirement** |  |
| **NFR06.1** | Danh sách món ăn phải được hiển thị trong vòng 2 giây |
| **System Message** |  |
| **MS06.1** | “Vui lòng kiểm tra lại kết nối!" |
| **MS06.2** | “Order đang trống. Vui lòng thêm món ăn” |
| **Bussiness Rules** |  |
| **BR06.1** | Chỉ cho phép thực hiện hành động "Xóa" hoặc "Thay đổi số lượng" đối với các món ăn ở trong giỏ hàng. |

1. **Đặc tả UC Tạo order**

| **Name** | Tạo order | **Code** | UC\_07 |
| **Description** | Thực khách thực hiện thêm các món ăn đầu tiên vào order |
| **Actor** | Thực khách | **Trigger** | Thực khách nhấn nút "Thêm" trên popup chi tiết món ăn |
| **Priority** | Must Have |
| **Pre\_Condition** | Tablet tại bàn đã được kích hoạt và đang ở giao diện Duyệt menu. |
| **Post\_Condition** | Order được khởi tạo thành công trong CSDL. |
| **Error situation** | Mất kết nối mạng tại thời điểm gửi đơn. Món ăn hết hàng ngay lúc khách nhấn “Thêm” vào order. |
| **System state in error situation** | Hệ thống giữ nguyên các món đã chọn trong giỏ hàng tạm thời và hiển thị thông báo lỗi để khách điều chỉnh. |
| **Activites Flow** |
| **Main Flow** |  |
| **Actor** | **System** |
| 1.  Thực khách chọn vào món ăn bất kỳ trong thực đơn 3\. Thực khách nhấn nút "Thêm". | 2\. Hệ thống hiển thị popup chi tiết món, nút “Thêm” và cập nhật số lượng \[-\] \[+\]. 4\. Hệ thống hiển thị thông báo “Đã thêm món ăn thành công” và thêm món ăn vào giỏ (Món không bị trùng). Nếu món ăn thêm bị trùng với món đã có thì cập nhật số lượng món đó trong giỏ. 5\. Số lượng món ăn được tự động cập nhật và hiển thị trên biểu tượng giỏ hàng ứng với số lượng món trong giỏ. 6\. Hệ thống cập nhật tổng tiền tạm tính. |
| **Alternative Flow** | 3a. Điều chỉnh món trước khi gửi |
| **Actor** | **System** |
| 3a1. Tại popup chờ thêm món vào order, khách thay đổi số lượng món bằng nút \[+\] \[-\] 3a2. UC tiếp tục bước 3 |  |
| **Exception Flow** | 4a. Lỗi món ăn hết hàng đột xuất |
| **Actor** | **System** |
| 4a3. UC quay lại bước 1 | 4a1. Khi khách nhấn Xác nhận, hệ thống kiểm tra CSDL thấy món ăn đã bị Bếp đánh dấu "Hết". 4a2. Hệ thống chặn lệnh thêm vào giỏ, hiển thị thông báo "Món \[Tên món\] hiện đã hết hàng. Quý khách vui lòng chọn món khác!" và bôi đỏ món bị hết trong danh sách. |
| **Non\_Functional Requirement** |  |
| **NFR07.1** | Thời gian từ lúc khách nhấn "Thêm" đến khi món hiện lên màn hình giỏ hàng không quá 2 giây. |
| **NFR07.2** | Hệ thống phải đảm bảo tính toàn vẹn dữ liệu (không tạo order trống) |
| **System Message** |  |
| **MS07.1** | "Món \[Tên món\] hiện đã hết hàng. Quý khách vui lòng chọn món khác!" |

1. **Xác nhận order**

| **Name** | Xác nhận order | **Code** | UC\_08 |
| **Description** | Thực khách gửi order xuống bếp và theo dõi trạng thái đơn hàng |
| **Actor** | Thực khách | **Trigger** | Thực khách nhấn nút "Xác nhận" trên giao diện giỏ hàng |
| **Priority** | Must Have |
| **Pre\_Condition** | Order đã được tạo trong giỏ hàng |
| **Post\_Condition** | Order được gửi xuống bếp thành công |
| **Error situation** | Mất kết nối mạng tại thời điểm gửi đơn. |
| **Activites Flow** |
| **Main Flow** |  |
| **Actor** | **System** |
| 1\. Thực khách ấn chọn vào nút “Xác nhận” trên giao diện giỏ hàng 4\. Thực khách ấn chọn nút “X” 5\. Thực khách ấn nút “Đóng” ở giao diện Đơn đặt | 1.  Hệ thống ghi nhận và lưu vào CSDL và gửi xuống bếp 2.  Hệ thống hiển thị thông báo “Đã gửi thành công” 3.  Hệ thống chuyển sang màn hình Đơn đặt và hiển thị các đơn đã gửi (gom theo order) kèm thời gian gửi và trạng thái món và tổng tiền tạm tính. 6, Quay lại màn hình chính thực đơn của chi nhánh. |
| **Alternative Flow** | 6a. Xem Đơn đặt tại màn hình chính |
| **Actor** | **System** |
| 6a1. Thực khách chọn vào nút “Đơn đặt” ở màn hình chính | 6a2. UC tiếp tục bước 4 |
| **Exception Flow** | 2a. Lỗi món ăn hết hàng đột xuất |
| **Actor** | **System** |
| 2a3. Thực khách xóa món bị hết và thực hiện lại Bước 1. | 2a1. Khi khách nhấn Xác nhận, hệ thống kiểm tra CSDL thấy món ăn đã bị Bếp đánh dấu "Hết". 2a2. Hệ thống chặn lệnh gửi, hiển thị thông báo "Món \[Tên món\] hiện đã hết hàng. Quý khách vui lòng chọn món khác!" và bôi đỏ món bị hết trong danh sách. |
| **Non\_Functional Requirement** |  |
| **NFR08.1** | Thời gian từ lúc khách nhấn "Xác nhận" đến khi món hiện lên màn hình Bếp không quá 2 giây. |
| **System Message** |  |
| **MS08.1** | "Món \[Tên món\] hiện đã hết hàng. Quý khách vui lòng chọn món khác!" |
| **Bussiness Rules** |  |
| **BR08.2** | Sau khi đã "Xác nhận", Thực khách không thể tự ý hủy món. |

1. **Đặc tả UC Xem hóa đơn tạm tính**

| **Name** | Xem hóa đơn tạm tính | **Code** | UC\_09 |
| **Description** | Thực khách xem lại danh sách tất cả các món ăn đã được xác nhận gửi bếp thành công và tổng số tiền thực tế cần thanh toán tính đến thời điểm hiện tại. |
| **Actor** | Thực khách | **Trigger** | Thực khách chọn vào nút “Hóa đơn” trên màn hình Tablet. |
| **Priority** | High |
| **Pre\_Condition** | Tablet tại bàn đang hoạt động và đã được gán mã bàn. |
| **Post\_Condition** | Thực khách nắm bắt được chính xác tổng chi phí bữa ăn để chuẩn bị thanh toán. |
| **Error situation** | Mất kết nối mạng hoặc lỗi truy xuất CSDL hóa đơn. |
| **System state in error situation** | Hệ thống hiển thị thông báo lỗi, không hiển thị dữ liệu sai lệch hoặc chưa được cập nhật. |
| **Activites Flow** |
| **Main Flow** |  |
| **Actor** | **System** |
| 1\. Thực khách chọn nút "Hóa đơn" trên giao diện chính 5\. Thực khách nhấn "Đóng". | 2\. Hệ thống truy xuất CSDL, lọc tất cả các món ăn thuộc mã bàn hiện tại đã được order (những món có trạng thái “Đã xong”) 4\. Hệ thống tổng hợp các order lại, tính toán và hiển thị: Danh sách món, Số lượng, Thành tiền từng món và dòng Tổng tiền cần thanh toán. (Danh sách món của từng order khác nhau) 6\. Hệ thống quay về màn hình chính. |
| **Exception Flow** | 2a. Bàn chưa gọi món nào |
| **Actor** | **System** |
| 2a3. Thực khách nhấn "Đóng". | 2a1. Hệ thống phát hiện bàn chưa có order nào hoặc các món chưa ở trạng thái “Đã xong” 2a2. Hệ thống hiển thị thông báo "Quý khách chưa gọi món nào. Vui lòng kiểm tra lại order!" 2a4. Hệ thống đóng popup và quay về màn hình chính. |
| **Exception Flow** | 2b. Lỗi mất kết nối máy chủ |
| **Actor** | **System** |
| 2b3. Thực khách nhấn "Thử lại". | 2b1. Hệ thống không thể kết nối với CSDL để tính tiền. 2b2. Hệ thống hiển thị thông báo "Lỗi kết nối máy chủ” kèm nút "Thử lại". 2b4. Hệ thống kết nối lại. Nếu thành công, tiếp tục Bước 2 |
| **Non\_Functional Requirement** |  |
| **NFR09.1** | Việc tính toán tổng tiền và tải dữ liệu hóa đơn phải hoàn thành dưới 2 giây. |
| **System Message** |  |
| **MS09.1** | "Quý khách chưa gọi món nào. Vui lòng kiểm tra lại order!" |
| **MS09.2** | "Lỗi kết nối máy chủ” |
| **Bussiness Rules** |  |
| **BR09.1** | Dữ liệu hiển thị trên màn hình Hóa đơn tạm tính chỉ bao gồm các món ăn nằm trong những Order đã được gửi xuống bếp và có trạng thái là “Đã xong” |

1. **Đặc tả UC Xử lý order**

| **Name** | Xử lý order | **Code** | UC\_10 |
| **Description** | Đầu bếp tiếp nhận và xử lý order được gửi tới từ khu vực bàn thực khách để chế biến. |
| **Actor** | Đầu bếp | **Trigger** | Đầu bếp chọn vào mục “Đơn hàng” trên giao diện Bếp |
| **Priority** | Must Have |
| **Pre\_Condition** | Đầu bếp đã đăng nhập thành công vào hệ thống. Hệ thống máy chủ đã ghi nhận order thành công từ Thực khách. |
| **Post\_Condition** | Trạng thái món được cập nhật, thực đơn được đồng bộ và khách hàng nhận được thông báo. |
| **Error situation** | Mất kết nối mạng hoặc lỗi truy xuất dữ liệu từ máy chủ tại thời điểm xác nhận. |
| **System state in error situation** | Thẻ order giữ nguyên ở cột "Chờ chế biến", hệ thống báo lỗi và yêu cầu xác nhận lại. |
| **Activites Flow** |
| **Main Flow** |  |
| **Actor** | **System** |
| 1\. Đầu bếp chọn “Đơn hàng” trên giao diện chính. 3\. Đầu bếp chọn vào danh mục “Tất cả” hoặc “Hàng đợi”. 5\. Đầu bếp chọn nút “Bắt đầu” của món tương ứng ở danh sách hàng đợi. 7\. Khi nấu xong, đầu bếp chọn nút “Đã xong” ở giao diện bếp. | 1.  Hệ thống hiển thị màn hình Đơn hàng gồm thanh lọc trạng thái món và chi tiết gồm: Số bàn, Thời gian đặt món, Danh sách các món ăn kèm số lượng và trạng thái. 4\. Hệ thống hiển thị tất cả các món hoặc các món ở Hàng đợi. 6\. Hệ thống cập nhật trạng thái của các món ăn ở giao diện bếp và giao diện Đơn đặt ở Tablet từ “Đã tiếp nhận” sang “Đang nấu” và đẩy món đó từ Hàng đợi lên danh sách Đang nấu. 8\. Hệ thống cập nhật trạng thái của các món ăn ở giao diện bếp và giao diện Đơn đặt ở Tablet từ “Đang nấu” sang “Đã xong” và đẩy món đó từ Đang nấu lên danh sách Đã xong. |
| **Exception Flow** | 5b. Món ăn hết nguyên liệu |
| **Actor** | **System** |
| 5b1. Đầu bếp chọn nút “Hủy món” | 5b2. Hệ thống đẩy món ăn đó xuống danh mục Đã hủy và cập nhật trạng thái thành “Đã hủy” ở giao diện của bếp và tablet của khách hàng. |
| **Alternative Flow** | 3a. Tìm kiếm theo tên món ăn |
| **Actor** | **System** |
| 3a1. Đầu bếp nhập tên món ăn để tìm kiếm trong thực đơn đã gửi xuống bếp | 3a2. Hệ thống truy xuất và hiển thị các món đã được gửi xuống bếp |
| **Non\_Functional Requirement** |  |
| **NFR10.1** | Chức năng Thông báo phải được thực thi theo thời gian thực để đảm bảo trải nghiệm xuyên suốt giữa Bếp và Thực khách. |
| **System Message** |  |
| **MS10.1** | "Lỗi kết nối máy chủ!" |
| **Bussiness Rules** |  |
| **BR10.1** | Hệ thống mặc định sắp xếp các thẻ order theo thời gian gửi |
| **BR10.1** | Không cho phép Đầu bếp "Hủy món" nếu món đó đã được cập nhật thành "Đang nấu". |

1. **Đặc tả UC Cập nhật thực đơn**

| **Name** | Cập nhật thực đơn | **Code** | UC\_11 |
| **Description** | Đầu bếp thiết lập thực đơn phục vụ đầu ngày bằng cách thêm món ăn mới và có thể thay đổi trạng thái phục vụ của món ăn trong suốt thời gian bán. |
| **Actor** | Đầu bếp | **Trigger** | Đầu bếp chọn "Quản lý thực đơn" trên màn hình bếp. |
| **Priority** | High |
| **Pre\_Condition** | Đầu bếp đã đăng nhập thành công vào hệ thống. |
| **Post\_Condition** | Trạng thái món ăn được cập nhật trong CSDL và đồng bộ theo thời gian thực. |
| **Error situation** | Mất kết nối mạng khiến việc cập nhật trạng thái không đồng bộ được xuống CSDL. |
| **System state in error situation** | Hệ thống báo lỗi cảnh báo. |
| **Activites Flow** |
| **Main Flow** |  |
| **Actor** | **System** |
| 1\. Đầu bếp chọn tab "Quản lý thực đơn" và nhấn nút "Thêm món ăn". 3\. Đầu bếp chọn 1 danh mục cụ thể trong popup 1.  Đầu bếp gạt nút trạng thái để thêm món vào thực đơn. 7\. Đầu bếp chọn nút “X” trên popup Thêm món. 9\. Đầu bếp chọn danh mục cụ thể ở giao diện Quản lý thực đơn. | 2\. Hệ thống hiển thị popup bao gồm thời gian và danh mục các món ăn tổng của nhà hàng. 4\. Hệ thống truy xuất dữ liệu và hiển thị danh sách món ăn của danh mục đã chọn bao gồm Tên món, giá tiền và nút gạt trạng thái. 6\. Hệ thống hiển thị thông báo “Thêm món thành công” .Món mới lập tức được thêm vào thực đơn trên giao diện bếp bao gồm tên món, nút gạt trạng thái, và giá tiền. Và xuất hiện trên Tablet tại chi nhánh của nhà hàng bao gồm trạng thái, tên món và giá tiền. 8\. Hệ thống trở về màn hình “Quản lý thực đơn” 10\. Hệ thống hiển thị các món ăn trong thực đơn mà đầu bếp đã thêm. |
| **Alternative Flow** | 9a. Tìm kiếm món để cập nhật trạng thái món trong ngày |
| **Actor** | **System** |
| 9a1. Đầu bếp gõ tên món vào thanh tìm kiếm. 9a3. Đầu bếp nhấn vào nút gạt để đổi trạng thái món | 9a2. Hệ thống lọc và hiển thị món ăn tương ứng. 9a4. Hệ thống lưu trạng thái mới và hiển thị thông báo “Cập nhật thành công” và đồng bộ với tablet. |
| **Exception Flow** | 10b. Món ăn hết nguyên liệu |
| **Actor** | **System** |
| 10b.1. Đầu bếp có thể gạt nút trạng thái để thay đổi trạng thái thành “Hết hàng” | 10b2. Hệ thống đổi trạng thái của món ăn thành Hết hàng và hiển thị thông báo “Cập nhật thành công” và đồng bộ với tablet |
| **Non\_Functional Requirement** |  |
| **NFR11.1** | Hình ảnh món ăn tải lên mượt mà, đảm bảo tốc độ tải trang trên Tablet không bị lag. |
| **System Message** |  |
| **MS11.1** | "Thêm món mới thành công" |
| **MS11.2** | "Cập nhật thành công." |

1. **Đặc tả UC Xác nhận order bàn**

| **Name** | Xác nhận order bàn | **Code** | UC\_12 |
| **Description** | Thu ngân kiểm tra, đối chiếu gom hóa đơn và chuẩn bị tiến hành thanh toán. |
| **Actor** | Thu ngân | **Trigger** | Khách hàng ra quầy báo số bàn và Thu ngân chọn bàn khách muốn thanh toán trên sơ đồ. |
| **Priority** | Must Have |
| **Pre\_Condition** | Thu ngân đã đăng nhập vào hệ thống Bàn khách đang ở trạng thái đang phục vụ. |
| **Post\_Condition** | Hệ thống khóa quyền gọi món tại bàn. Trạng thái bàn chuyển sang “Chờ thanh toán” |
| **Error situation** | Mất kết nối mạng khi đang thực hiện xác nhận. |
| **System state in error situation** | Hệ thống giữ nguyên trạng thái bàn chưa chốt, hiển thị thông báo lỗi mạng. |
| **Activites Flow** |
| **Main Flow** |  |
| **Actor** | **System** |
| 1\. Thu ngân chọn số bàn tương ứng của khách trên màn hình 4\. Thu ngân nhấn nút "Chốt bàn". | 2\. Hệ thống truy xuất và hiển thị tổng hợp tất cả các order của bàn đó. 5\. Hệ thống cập nhật trạng thái bàn thành “Chờ thanh toán” và vô hiệu hóa chức năng gọi món trên Tablet tại bàn đó. 6\. Hệ thống chuyển giao diện sang màn hình "Thanh toán hóa đơn". |
| **Exception Flow** | 2a. Bàn trống |
| **Actor** | **System** |
| UC quay lại bước 1 | 2a1. Hệ thống phát hiện bàn được chọn chưa có order nào 2a2. Hệ thống hiển thị thông báo "Bàn này chưa có order". |
| **Exception Flow** | 5a. Lỗi mất kết nối máy chủ |
| **Actor** | **System** |
| 5a3. Thu ngân nhấn "Thử lại". | 5a1. Hệ thống không thể ghi nhận trạng thái chốt bàn do lỗi mạng. 5a2. Hệ thống chặn việc chuyển sang màn hình thanh toán và báo lỗi "Lỗi kết nối máy chủ” 5a4. Hệ thống thực hiện kết nối lại. |
| **Non\_Functional Requirement** |  |
| **NFR012.1** | Giao diện hiển thị hóa đơn đối chiếu phải rõ ràng |
| **System Message** |  |
| **MS012.1** | "Bàn này chưa có order" |
| **MS012.2** | "Lỗi kết nối máy chủ” |
| **Bussiness Rules** |  |
| **BR012.1** | Thu ngân bắt buộc phải chốt bàn thì hệ thống mới cho phép thanh toán. Bàn đã chốt thì Tablet tương ứng với bàn không thể gọi thêm món. |

1. **Đặc tả UC Thanh toán hóa đơn**

| **Name** | Thanh toán hóa đơn | **Code** | UC\_13 |
| **Description** | Thu ngân tiến hành thanh toán hóa đơn, xử lý tích điểm, đổi điểm nếu khách là thành viên và giải phóng bàn. |
| **Actor** | Thu ngân | **Trigger** | Thu ngân chọn “Chốt bàn” của bàn muốn thanh toán. |
| **Priority** | High |
| **Pre\_Condition** | Thu ngân đã đăng nhập. Bàn khách đang ở trạng thái “Chờ thanh toán” |
| **Post\_Condition** | Hóa đơn được lưu vào CSDL Trạng thái bàn được chuyển về thành trống và làm mới màn hình Tablet |
| **Activites Flow** |
| **Main Flow** |  |
| **Actor** | **System** |
| 2\. Thu ngân nhập SĐT khách hàng 4\. Chọn phương thức "Tiền mặt". 5\. Nhập số tiền khách đưa. 7\. Thu ngân nhấn "Thanh toán" | 1\. Hệ thống hiển thị chi tiết hóa đơn của số bàn đã chốt và ô nhập SĐT khách hàng. 3\. Hệ thống kiểm tra SĐT, hiển thị thông tin khách và tổng tiền hóa đơn 6\. Tính toán và hiển thị "Số tiền trả lại". 8\. Cộng điểm thưởng cho khách theo SĐT dựa trên số tiền thực trả. 9\. Hệ thống cập nhật trạng thái hóa đơn thành đã thanh toán và in bill và lưu dữ liệu hóa đơn vào hệ thống. 10\. Hệ thống chuyển bàn về trạng thái trống và làm mới Tablet. |
| **Alternative Flow** | 4a. Khách hàng thanh toán bằng Quét mã QR |
| **Actor** | **System** |
| 4a1. Thu ngân chọn phương thức "Quét mã QR". 4a4. Khách hàng quét mã và chuyển tiền. 4a5. Thu ngân kiểm tra thông báo nhận tiền và nhấn "Xác nhận". | 4a2. Hệ thống tự động sinh mã QR 4a3. Hệ thống hiển thị mã QR lên màn hình 4a6. UC tiếp tục bước 8 |
| **Alternative Flow** | 3c. Đăng ký khách hàng mới |
| **Actor** | **System** |
| 3c1. Thu ngân chọn nút "Đăng ký". 3c3. Thu ngân nhập tên khách hàng và nhấn "Lưu". 4c5. Tiếp tục quay lại Bước 4. | 3c2. Hệ thống hiển thị Form đăng ký nhanh (Tên, SĐT) 3c4. Hệ thống lưu vào CSDL, hiển thị thông báo thành công. |
| **Alternative Flow** | 3a. Khách hàng sử dụng điểm tích lũy để giảm giá |
| **Actor** | **System** |
| 3a1. Thu ngân nhập số điểm muốn đổi trên màn hình. 3a4. UC tiếp tục bước 4 đến bước 9 | 3a2. Hệ thống kiểm tra số điểm vừa nhập 3a3. Nếu hợp lệ, hệ thống quy đổi điểm thành tiền, trừ trực tiếp vào Tổng tiền và hiển thị dòng: "Được giảm trừ \[Số tiền\]" 3a5. Khi hóa đơn hoàn tất ở Bước 9, hệ thống tự động trừ số điểm khách đã dùng. UC tiếp tục bước 10 |
| **Exception Flow** | 3b. Số điểm yêu cầu đổi không hợp lệ |
| **Actor** | **System** |
| 3b3. Thu ngân báo lại cho khách, nhập lại số điểm hợp lệ hoặc hủy thao tác đổi điểm. | 3b1. Tại bước 3a2, hệ thống phát hiện số điểm nhập không hợp lệ 3b2. Hệ thống bôi đỏ ô nhập liệu báo lỗi "Số điểm nhập vào không hợp lệ” |
| **Exception Flow** | 5a. Thu ngân nhập thiếu tiền mặt |
| **Actor** | **System** |
| 5a3. Thu ngân kiểm tra lại tiền thực tế và nhập lại vào hệ thống. | 5a1. Tại bước 5 của luồng chính, hệ thống phát hiện: Số tiền khách đưa < Tổng tiền phải trả. 5a2. Hệ thống chặn thao tác xác nhận, hiển thị cảnh báo đỏ "Số tiền khách đưa không đủ” và yêu cầu nhập lại đúng số tiền. |
| **Non\_Functional Requirement** |  |
| **NFR013.1** | Mã QR sinh ra ở luồng 4a phải hiển thị rõ trên màn hình. |
| **System Message** |  |
| **MS013.1** | "Số tiền khách đưa không đủ” |
| **MS013.2** | "Số điểm nhập vào không hợp lệ” |
| **Bussiness Rules** |  |
| **BR013.1** | Sau khi hóa đơn chuyển sang trạng thái đã thanh toán, không ai được phép sửa đổi thông tin các món ăn trong hóa đơn đó nữa. |
| **BR013.2** | Tablet tại bàn bắt buộc phải reset ngay sau khi thu ngân chốt thanh toán để đảm bảo bảo mật cho khách tiếp theo. |

1. **Đặc tả UC Tra cứu hóa đơn**

| **Name** | Tra cứu hóa đơn | **Code** | UC\_14 |
| **Description** | Thu ngân tìm kiếm, xem lại thông tin chi tiết của các hóa đơn đã thanh toán trước đó và thực hiện in lại biên lai nếu cần thiết. |
| **Actor** | Thu ngân | **Trigger** | Thu ngân chọn chức năng “Quản lý hóa đơn” trên màn hình thu ngân. |
| **Priority** | Medium |
| **Pre\_Condition** | Thu ngân đã đăng nhập vào hệ thống. |
| **Post\_Condition** | Hệ thống hiển thị đúng hóa đơn cần tìm và thực hiện lệnh in lại (nếu có). |
| **Error situation** | Mất kết nối CSDL khiến không thể tải danh sách hóa đơn. |
| **System state in error situation** | Hiển thị màn hình trống hoặc thông báo lỗi, giữ nguyên trạng thái hệ thống. |
| **Activites Flow** |
| **Main Flow** |  |
| **Actor** | **System** |
| 1\. Thu ngân chọn “Quản lý hóa đơn” trên giao diện. 3\. Thu ngân nhập mã hóa đơn cần tra cứu trên thanh tìm kiếm hoặc chọn mốc thời gian (Từ ngày - Đến ngày). 5\. Nhấp chọn một hóa đơn cụ thể trong danh sách kết quả. | 2\. Hệ thống tải và hiển thị danh sách các hóa đơn mới nhất 4\. Hệ thống truy xuất CSDL, lọc và hiển thị danh sách hóa đơn khớp với mã bàn. 6\. Hệ thống hiển thị Popup chi tiết hóa đơn cần tìm kiếm |
| **Alternative Flow** | 6a. In lại hóa đơn |
| **Actor** | **System** |
| 6a1. Tại màn hình chi tiết hóa đơn Thu ngân nhấn nút "In lại hóa đơn". | 6a2. Hệ thống gửi lệnh xuất file và in lại biên lai. 6a3. Trên tờ bill in ra sẽ có thêm dòng chữ “hóa đơn in lại” để phân biệt với bill gốc. |
| **Exception Flow** | 4a. Không tìm thấy kết quả |
| **Actor** | **System** |
| 4a3. Thu ngân xóa từ khóa và nhập lại. | 4a1. Hệ thống không tìm thấy hóa đơn nào khớp với từ khóa thu ngân nhập vào với khoảng thời gian tìm kiếm. 4a2. Hệ thống hiển thị thông báo "Không tìm thấy hóa đơn nào” và làm trống danh sách kết quả. Hệ thống quay lại bước 4. |
| **Non\_Functional Requirement** |  |
| **NFR014.1** | Dữ liệu trả về ở danh sách phải được cuộn tải để tránh treo máy nếu dữ liệu hóa đơn quá lớn. |
| **System Message** |  |
| **MS014.1** | "Không tìm thấy hóa đơn nào” |
| **MS014.2** | "Lỗi kết nối đến máy chủ" |
| **Bussiness Rules** |  |
| **BR014.1** | Thu ngân tuyệt đối không được phép chỉnh sửa trên các hóa đơn đã ở trạng thái đã thanh toán |
| **BR014.2** | Hệ thống phải ghi log mỗi khi Thu ngân bấm "In lại hóa đơn" |
