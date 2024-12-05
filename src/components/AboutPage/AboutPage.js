import React from "react";

const AboutPage = () => {
  return (
    <>
      <div className="container my-3 py-3">
        <h1 className="text-center">HOW TO GET WHAT U WANT?</h1>
        <hr />
        <div
          className="lead text-start"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <p className="fw-bold">STEP 1</p>
          <p className="context">
            : Nhấp vào <b>Products</b> trên thanh điều hướng hoặc nhấp vào <b>SHOP NOW</b>
          </p>
        </div>
        <img src="./assets/HOW/HD1.png" className="img-fluid" alt="Step 1" />

        <div
          className="lead text-start"
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <p className="fw-bold">STEP 2</p>
          <p className="context">: Lựa chọn sản phẩm mình muốn</p> Lúc này trang web sẽ điều hướng
          đến trang chi tiết sản phẩm
        </div>
        <img src="./assets/HOW/HD2.png" className="img-fluid" alt="Step 2" />

        <div
          className="lead text-start"
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <p className="fw-bold">STEP 3</p>
          <p className="context">
            : Nhấp vào <b>Add to card</b> để thêm sản phẩm vào giỏ hàng{" "}
          </p>
        </div>
        <img src="./assets/HOW/HD3.png" className="img-fluid" alt="Step 3" />

        <div
          className="lead text-start"
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <p className="fw-bold">STEP 4</p>
          <p className="context">
            : Nhấp vào <b>Go to cart</b> (hoặc <b>Cart</b>) để xem giỏ hàng
          </p>
        </div>
        <img src="./assets/HOW/HD4.png" className="img-fluid" alt="Step 4" />

        <div
          className="lead text-start"
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <p className="fw-bold">STEP 5</p>: Lúc này bạn có thể kiểm tra số lượng, tổng tiền trong
          giỏ hàng
        </div>
        <img src="./assets/HOW/HD5.png" className="img-fluid" alt="Step 5" />
      </div>
      <div
        className="text-end"
        style={{ textAlign: "right", fontWeight: "bold", fontSize: "20px" }}
      >
        <i>"Thank you for purchasing from us."</i>
      </div>
    </>
  );
};

export default AboutPage;
