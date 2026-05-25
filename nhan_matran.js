
module nhan_matran (

    input  logic        clk,
    input  logic        rst,

    // =========================================
    // WRITE CONTROL
    // =========================================

   

    input  logic        start,

    // =========================================
    // OUTPUT MATRIX C
    // =========================================
    input  logic [1:0]  sel_row,
    input  logic [1:0]  sel_col,
	 
    output logic [6:0] HEX0,
    output logic [6:0] HEX1,
    output logic [6:0] HEX2,
    output logic [6:0] HEX3,
    output logic [6:0] HEX4,
output logic [6:0] HEX5,
output logic [6:0] HEX6,
output logic [6:0] HEX7,
output logic [19:0] C00,C10,C20,C30, C33
);

    // =====================================================
    // SKEWED STREAM SIGNALS
    // =====================================================

    logic [18:0] a0_stream;
    logic [18:0] a1_stream;
    logic [18:0] a2_stream;
    logic [18:0] a3_stream;

    logic [18:0] b0_stream;
    logic [18:0] b1_stream;
    logic [18:0] b2_stream;
    logic [18:0] b3_stream;
	 logic rd;
    logic [18:0]  C01, C02, C03;
    logic [18:0] C11, C12, C13;
    logic [18:0]  C21, C22, C23;
    logic [18:0]  C31, C32;
	 
	 output_7seg_display u_display (

        .sel_row(sel_row),
        .sel_col(sel_col),

        //.C00(C00),
        .C01(C01),
        .C02(C02),
        .C03(C03),

        //.C10(C10),
        .C11(C11),
        .C12(C12),
        .C13(C13),

        //.C20(C20),
        .C21(C21),
        .C22(C22),
        .C23(C23),

       // .C30(C30),
        .C31(C31),
        .C32(C32),
        //.C33(C33),

        .HEX0(HEX0),
        .HEX1(HEX1),
        .HEX2(HEX2),
        .HEX3(HEX3),
        .HEX4(HEX4),
		  .HEX5(HEX5),
    .HEX6(HEX6),
    .HEX7(HEX7)

    );
	 


    // =====================================================
    // INPUT BUFFER + SKEW STREAMER
    // =====================================================

    input_buffer_skew u_input_buffer (

        .clk        (clk),
        .rst        (rst),

        .rd_en      (start),

        .a0_out     (a0_stream),
        .a1_out     (a1_stream),
        .a2_out     (a2_stream),
        .a3_out     (a3_stream),

        .b0_out     (b0_stream),
        .b1_out     (b1_stream),
        .b2_out     (b2_stream),
        .b3_out     (b3_stream)

    );

    // =====================================================
    // SYSTOLIC ARRAY
    // =====================================================

    systolic_array_4x4 u_systolic (

        .clk(clk),
        .rst(rst),

        .a0_in(a0_stream),
        .a1_in(a1_stream),
        .a2_in(a2_stream),
        .a3_in(a3_stream),

        .b0_in(b0_stream),
        .b1_in(b1_stream),
        .b2_in(b2_stream),
        .b3_in(b3_stream),

        .c00(C00),
        .c01(C01),
        .c02(C02),
        .c03(C03),

        .c10(C10),
        .c11(C11),
        .c12(C12),
        .c13(C13),

        .c20(C20),
        .c21(C21),
        .c22(C22),
        .c23(C23),

        .c30(C30),
        .c31(C31),
        .c32(C32),
        .c33(C33)

    );

endmodule

module systolic_array_4x4 (
    input  logic        clk,
    input  logic        rst,

    input  logic [18:0] a0_in,
    input  logic [18:0] a1_in,
    input  logic [18:0] a2_in,
    input  logic [18:0] a3_in,

    input  logic [18:0] b0_in,
    input  logic [18:0] b1_in,
    input  logic [18:0] b2_in,
    input  logic [18:0] b3_in,

    output logic [18:0] c00, c01, c02, c03,
    output logic [18:0] c10, c11, c12, c13,
    output logic [18:0] c20, c21, c22, c23,
    output logic [18:0] c30, c31, c32, c33
);

    logic [18:0] a_bus [0:3][0:4];
    logic [18:0] b_bus [0:4][0:3];

    // ======================================
    // Inputs
    // ======================================

    assign a_bus[0][0] = a0_in;
    assign a_bus[1][0] = a1_in;
    assign a_bus[2][0] = a2_in;
    assign a_bus[3][0] = a3_in;

    assign b_bus[0][0] = b0_in;
    assign b_bus[0][1] = b1_in;
    assign b_bus[0][2] = b2_in;
    assign b_bus[0][3] = b3_in;

    // ======================================
    // PE array
    // ======================================

    pe PE00 (.clk(clk), .rst(rst), .a(a_bus[0][0]), .b(b_bus[0][0]), .a_out(a_bus[0][1]), .b_out(b_bus[1][0]), .c(c00));
    pe PE01 (.clk(clk), .rst(rst), .a(a_bus[0][1]), .b(b_bus[0][1]), .a_out(a_bus[0][2]), .b_out(b_bus[1][1]), .c(c01));
    pe PE02 (.clk(clk), .rst(rst), .a(a_bus[0][2]), .b(b_bus[0][2]), .a_out(a_bus[0][3]), .b_out(b_bus[1][2]), .c(c02));
    pe PE03 (.clk(clk), .rst(rst), .a(a_bus[0][3]), .b(b_bus[0][3]), .a_out(a_bus[0][4]), .b_out(b_bus[1][3]), .c(c03));

    pe PE10 (.clk(clk), .rst(rst), .a(a_bus[1][0]), .b(b_bus[1][0]), .a_out(a_bus[1][1]), .b_out(b_bus[2][0]), .c(c10));
    pe PE11 (.clk(clk), .rst(rst), .a(a_bus[1][1]), .b(b_bus[1][1]), .a_out(a_bus[1][2]), .b_out(b_bus[2][1]), .c(c11));
    pe PE12 (.clk(clk), .rst(rst), .a(a_bus[1][2]), .b(b_bus[1][2]), .a_out(a_bus[1][3]), .b_out(b_bus[2][2]), .c(c12));
    pe PE13 (.clk(clk), .rst(rst), .a(a_bus[1][3]), .b(b_bus[1][3]), .a_out(a_bus[1][4]), .b_out(b_bus[2][3]), .c(c13));

    pe PE20 (.clk(clk), .rst(rst), .a(a_bus[2][0]), .b(b_bus[2][0]), .a_out(a_bus[2][1]), .b_out(b_bus[3][0]), .c(c20));
    pe PE21 (.clk(clk), .rst(rst), .a(a_bus[2][1]), .b(b_bus[2][1]), .a_out(a_bus[2][2]), .b_out(b_bus[3][1]), .c(c21));
    pe PE22 (.clk(clk), .rst(rst), .a(a_bus[2][2]), .b(b_bus[2][2]), .a_out(a_bus[2][3]), .b_out(b_bus[3][2]), .c(c22));
    pe PE23 (.clk(clk), .rst(rst), .a(a_bus[2][3]), .b(b_bus[2][3]), .a_out(a_bus[2][4]), .b_out(b_bus[3][3]), .c(c23));

    pe PE30 (.clk(clk), .rst(rst), .a(a_bus[3][0]), .b(b_bus[3][0]), .a_out(a_bus[3][1]), .b_out(b_bus[4][0]), .c(c30));
    pe PE31 (.clk(clk), .rst(rst), .a(a_bus[3][1]), .b(b_bus[3][1]), .a_out(a_bus[3][2]), .b_out(b_bus[4][1]), .c(c31));
    pe PE32 (.clk(clk), .rst(rst), .a(a_bus[3][2]), .b(b_bus[3][2]), .a_out(a_bus[3][3]), .b_out(b_bus[4][2]), .c(c32));
    pe PE33 (.clk(clk), .rst(rst), .a(a_bus[3][3]), .b(b_bus[3][3]), .a_out(a_bus[3][4]), .b_out(b_bus[4][3]), .c(c33));

endmodule
module pe (
    input  logic        clk,
    input  logic        rst,

    input  logic [18:0] a,
    input  logic [18:0] b,

    output logic [18:0] a_out,
    output logic [18:0] b_out,

    output logic [18:0] c
);

    // ====================== Internal signals ======================

    logic [31:0] mul;
    logic [31:0] muls;

    logic [31:0] accu;
    logic [31:0] accus;

    // forwarding pipeline registers
    logic [18:0] a_r;
    logic [18:0] b_r;

    // ====================== Multiplier ======================

    multi mult_inst (
        .a (a),
        .b (b),
        .c (mul)
    );

    // ====================== Adder ======================

    add add_inst (
        .a (muls),
        .b (accus),
        .c (accu)
    );

    // ====================== Pipeline Registers ======================

    always_ff @(posedge clk or posedge rst) begin

        if (rst) begin

            muls  <= '0;
            accus <= '0;

            a_r <= '0;
        

            b_r <= '0;
       

        end
        else begin

            //-----------------------------------------
            // MAC pipeline
            //-----------------------------------------

            muls  <= mul;

            accus <= accu;

            //-----------------------------------------
            // Forward pipeline
            //-----------------------------------------

            
            a_r <= a;

          
            b_r <= b;

        end
    end

    // ====================== Outputs ======================

    assign c     = accus[31:13];

    assign a_out = a_r;
    assign b_out = b_r;

endmodule


module multi(
    input logic [18:0] a, b,        // TF32 inputs
    output logic [31:0] c           // FP32 output
);
    // --- Các tín hiệu trung gian ---
    logic sign_a, sign_b, sign_res;
    logic [7:0] exp_a, exp_b;
    logic [10:0] mant_a, mant_b;
    logic [21:0] mant_mult;
    logic [8:0] exp_sum;

    // ====================== SPECIAL CASES DETECTION ======================
    logic is_nan_a, is_nan_b;
    logic is_inf_a, is_inf_b;
    logic is_zero_a, is_zero_b;

    assign is_nan_a  = (exp_a == 8'hFF && a[9:0] != 0);   // TF32 19-bit
    assign is_nan_b  = (exp_b == 8'hFF && b[9:0] != 0);
    assign is_inf_a  = (exp_a == 8'hFF && a[9:0] == 0);
    assign is_inf_b  = (exp_b == 8'hFF && b[9:0] == 0);
    assign is_zero_a = (exp_a == 8'h00);
    assign is_zero_b = (exp_b == 8'h00);

    // ====================== Normal Computation ======================
    // Giai đoạn 1: Tách dữ liệu và nhân
    assign sign_a = a[18];
    assign exp_a  = a[17:10];
    assign mant_a = {1'b1, a[9:0]};
    assign sign_b = b[18];
    assign exp_b  = b[17:10];
    assign mant_b = {1'b1, b[9:0]};
    assign sign_res = sign_a ^ sign_b;
    assign mant_mult = mant_a * mant_b;
    assign exp_sum = exp_a + exp_b - 9'd127;

    logic [31:0] normal_result;

    // Giai đoạn 2: Chuẩn hóa (Normal case)
    always_comb begin
        if (mant_mult[21]) begin
            normal_result[31] = sign_res;
            normal_result[30:23] = exp_sum[7:0] + 1'b1;
            normal_result[22:0] = {mant_mult[20:0], 2'b00};
        end else begin
            normal_result[31] = sign_res;
            normal_result[30:23] = exp_sum[7:0];
            normal_result[22:0] = {mant_mult[19:0], 3'b000};
        end
    end

    // ====================== Final Output with Special Cases ======================
    always_comb begin
        if (is_nan_a || is_nan_b) begin
            c = 32'h7FC00000;                    // Quiet NaN
        end
        else if (is_inf_a && is_inf_b) begin
            c = {sign_res, 8'hFF, 23'd0};        // Inf * Inf = Inf (có dấu)
        end
        else if (is_inf_a) begin
            c = {sign_a, 8'hFF, 23'd0};          // Inf * number
        end
        else if (is_inf_b) begin
            c = {sign_b, 8'hFF, 23'd0};
        end
        else if (is_zero_a || is_zero_b) begin
            c = {sign_res, 8'h00, 23'd0};        // 0 * number = 0 (có dấu)
        end
        else begin
            c = normal_result;                   // Normal multiplication
        end
    end

endmodule

module add(
    input logic [31:0] a,
    input logic [31:0] b,
    output logic [31:0] c
);
    // =========================
    // UNPACK
    // =========================
    logic sign_a, sign_b;
    logic [7:0] exp_a, exp_b;
    logic [23:0] mant_a, mant_b;
    assign sign_a = a[31];
    assign sign_b = b[31];
    assign exp_a = a[30:23];
    assign exp_b = b[30:23];
    assign mant_a = {1'b1, a[22:0]};
    assign mant_b = {1'b1, b[22:0]};

    // ====================== SPECIAL CASES ======================
    logic is_nan, is_inf_a, is_inf_b, is_zero_a, is_zero_b;

    assign is_nan    = (exp_a == 8'hFF && a[22:0] != 0) || (exp_b == 8'hFF && b[22:0] != 0);
    assign is_inf_a  = (exp_a == 8'hFF && a[22:0] == 0);
    assign is_inf_b  = (exp_b == 8'hFF && b[22:0] == 0);
    assign is_zero_a = (exp_a == 8'h00);
    assign is_zero_b = (exp_b == 8'h00);

    // ====================== Normal computation signals (code cũ) ======================
    logic sign_large, sign_small;
    logic [7:0] exp_large, exp_small;
    logic [23:0] mant_large, mant_small;
    logic [7:0] delta_exp;
    logic [49:0] mant_small_ext,mant_lagre_ext;
    logic [49:0] mant_small_shifted;
    logic g,r,s,guard, round_bit, sticky;
    logic [23:0] mant_min;
    logic sign_result;
    logic [24:0] mant_sum;
    logic [23:0] mant_norm;
    logic [7:0] exp_norm;
    int shift;
    logic round_up, lsb;
    logic [24:0] mant_final;
    logic [31:0] normal_result;

    // always_comb cũ - Tính kết quả normal
    always_comb begin
        // LARGE / SMALL SELECT
        if ((exp_a > exp_b) ||((exp_a == exp_b) && (mant_a >= mant_b))) begin
            exp_large = exp_a;  exp_small = exp_b;
            sign_large = sign_a; sign_small = sign_b;
            mant_large = mant_a; mant_small = mant_b;
        end else begin
            exp_large = exp_b;  exp_small = exp_a;
            sign_large = sign_b; sign_small = sign_a;
            mant_large = mant_b; mant_small = mant_a;
        end

        delta_exp = exp_large - exp_small;

        mant_small_ext = {mant_small, 26'd0};
        if (delta_exp > 26) begin
		  g = 1'b0;
		  r = 1'b0;
            s = |mant_small[23:0];
            mant_small_shifted = 57'd0;
        end else begin
            mant_small_shifted = mant_small_ext >> delta_exp;
            g = mant_small_shifted[25];
            r = mant_small_shifted[24];
            s = |mant_small_shifted[23:0];
        end
        mant_min = mant_small_shifted[49:26];

        // ADD / SUB
        mant_sum = 25'b0;
        sign_result = sign_large;
        if (sign_large == sign_small) begin
            mant_sum = mant_large + mant_min;
        end else begin
            if (mant_large >= mant_min) begin
                mant_sum = mant_large - mant_min;
            end else begin
                mant_sum = mant_min - mant_large;
                sign_result = sign_small;
            end
        end

        // NORMALIZE
        mant_norm = 24'd0; shift = 0;
		  
        if (mant_sum[24]) begin
            mant_norm = mant_sum[24:1];
				guard=mant_sum[0];
				round_bit = g;
				sticky = r|s;
            exp_norm = exp_large + 1;
        end else if (mant_sum[23]) begin
            mant_norm = mant_sum[23:0];
				guard =g;
				round_bit = r;
				sticky = s;
            exp_norm = exp_large;
        end else begin
            shift = 0;
            for (int i = 23; i >= 0; i--) begin
                if (mant_sum[i] && shift == 0) shift = 23 - i;
            end
            mant_norm = mant_sum[23:0] << shift;
            exp_norm = exp_large - shift;
				guard =g;
				round_bit = r;
				sticky = s;
        end

        // ROUNDING
        lsb = mant_norm[0];
        round_up = (guard && (round_bit | sticky)) | (guard && !round_bit && !sticky && lsb);
        mant_final = round_up ? mant_norm + 1'b1 : mant_norm;

        normal_result = {sign_result, exp_norm, mant_final[22:0]};
		  if (mant_final[24]) begin

    mant_final =
        mant_final >> 1;

    exp_norm =
        exp_norm + 1;

end
    end
	
    // ====================== Final Output with Special Cases ======================
    always_comb begin
        if (is_nan) 
            c = 32'h7FC00000;                    // Quiet NaN
        else if (is_inf_a && is_inf_b) begin
            if (sign_a == sign_b)
                c = {sign_a, 8'hFF, 23'd0};      // +Inf hoặc -Inf
            else
                c = 32'h7FC00000;                // Inf + (-Inf) = NaN
        end
        else if (is_inf_a)
            c = {sign_a, 8'hFF, 23'd0};
        else if (is_inf_b)
            c = {sign_b, 8'hFF, 23'd0};
        else if (is_zero_a && is_zero_b)
            c = {sign_a & sign_b, 8'h00, 23'd0}; // +0 hoặc -0
        else if (is_zero_a)
            c = b;
        else if (is_zero_b)
            c = a;
        else
            c = normal_result;                   // Normal case
    end

endmodule


module controller (
    input  logic clk,
    input  logic rst,
    input  logic in_sig,

    output logic out_sig,
    output logic done
);

logic [3:0] count;
logic in_d;
logic busy;

always_ff @(posedge clk or posedge rst) begin
    if (rst) begin
        out_sig <= 1'b0;
        done    <= 1'b0;
        busy    <= 1'b0;
        count   <= 4'd0;
        in_d    <= 1'b0;
    end
    else begin

        in_d <= in_sig;

        // kích bắt đầu
        if (!busy && in_sig && !in_d) begin
            busy    <= 1'b1;
            out_sig <= 1'b1;
            done    <= 1'b0;
            count   <= 4'd0;
        end

        // đang chạy
        else if (busy) begin

            // giữ output 1 trong 7 chu kỳ
            if (count == 4'd6)
                out_sig <= 1'b0;

            // sau 13 chu kỳ bật done và giữ luôn
            if (count == 4'd12) begin
                done  <= 1'b1;
                busy  <= 1'b0;
                count <= 4'd0;
            end
            else begin
                count <= count + 1'b1;
            end
        end

    end
end

endmodule

module output_7seg_display (

    // =========================================
    // OUTPUT SELECT
    // =========================================

    input  logic [1:0] sel_row,
    input  logic [1:0] sel_col,

    // =========================================
    // MATRIX C INPUT
    // =========================================

    input  logic [18:0] C00,
    input  logic [18:0] C01,
    input  logic [18:0] C02,
    input  logic [18:0] C03,

    input  logic [18:0] C10,
    input  logic [18:0] C11,
    input  logic [18:0] C12,
    input  logic [18:0] C13,

    input  logic [18:0] C20,
    input  logic [18:0] C21,
    input  logic [18:0] C22,
    input  logic [18:0] C23,

    input  logic [18:0] C30,
    input  logic [18:0] C31,
    input  logic [18:0] C32,
    input  logic [18:0] C33,

    // =========================================
    // 7-SEG OUTPUT
    // =========================================

    output logic [6:0] HEX0,
    output logic [6:0] HEX1,
    output logic [6:0] HEX2,
    output logic [6:0] HEX3,
    output logic [6:0] HEX4,
    output logic [6:0] HEX5,
    output logic [6:0] HEX6,
    output logic [6:0] HEX7

);

    // =====================================================
    // SELECTED DATA
    // =====================================================

    logic [18:0] selected_data;

    // =====================================================
    // SELECT MATRIX ELEMENT
    // =====================================================

    always_comb begin

        case ({sel_row, sel_col})

            4'b0000: selected_data = C00;
            4'b0001: selected_data = C01;
            4'b0010: selected_data = C02;
            4'b0011: selected_data = C03;

            4'b0100: selected_data = C10;
            4'b0101: selected_data = C11;
            4'b0110: selected_data = C12;
            4'b0111: selected_data = C13;

            4'b1000: selected_data = C20;
            4'b1001: selected_data = C21;
            4'b1010: selected_data = C22;
            4'b1011: selected_data = C23;

            4'b1100: selected_data = C30;
            4'b1101: selected_data = C31;
            4'b1110: selected_data = C32;
            4'b1111: selected_data = C33;

            default: selected_data = 19'd0;

        endcase

    end

    // =====================================================
    // DATA DISPLAY
    // =====================================================

    hex7seg h0 (
        .bin(selected_data[3:0]),
        .seg(HEX0)
    );

    hex7seg h1 (
        .bin(selected_data[7:4]),
        .seg(HEX1)
    );

    hex7seg h2 (
        .bin(selected_data[11:8]),
        .seg(HEX2)
    );

    hex7seg h3 (
        .bin(selected_data[15:12]),
        .seg(HEX3)
    );

    hex7seg h4 (
        .bin({1'b0, selected_data[18:16]}),
        .seg(HEX4)
    );

    // =====================================================
    // HEX5 OFF
    // =====================================================

    assign HEX5 = 7'b1111111;

    // =====================================================
    // SHOW COLUMN
    // =====================================================

    hex7seg h6 (
        .bin({2'b00, sel_col}),
        .seg(HEX6)
    );

    // =====================================================
    // SHOW ROW
    // =====================================================

    hex7seg h7 (
        .bin({2'b00, sel_row}),
        .seg(HEX7)
    );

endmodule



module hex7seg (

    input  logic [3:0] bin,
    output logic [6:0] seg

);

    always_comb begin

        case (bin)

            4'h0: seg = 7'b1000000;
            4'h1: seg = 7'b1111001;
            4'h2: seg = 7'b0100100;
            4'h3: seg = 7'b0110000;

            4'h4: seg = 7'b0011001;
            4'h5: seg = 7'b0010010;
            4'h6: seg = 7'b0000010;
            4'h7: seg = 7'b1111000;

            4'h8: seg = 7'b0000000;
            4'h9: seg = 7'b0010000;

            4'hA: seg = 7'b0001000;
            4'hB: seg = 7'b0000011;
            4'hC: seg = 7'b1000110;
            4'hD: seg = 7'b0100001;

            4'hE: seg = 7'b0000110;
            4'hF: seg = 7'b0001110;

            default: seg = 7'b1111111;

        endcase

    end

endmodule


module input_buffer_skew (

    input  logic        clk,
    input  logic        rst,

    input  logic        rd_en,

    output logic [18:0] a0_out,
    output logic [18:0] a1_out,
    output logic [18:0] a2_out,
    output logic [18:0] a3_out,

    output logic [18:0] b0_out,
    output logic [18:0] b1_out,
    output logic [18:0] b2_out,
    output logic [18:0] b3_out

);

    // ========================================================
    // INTERNAL SIGNALS
    // ========================================================

    logic [2:0] cycle;

    logic [18:0] a0_mem;
    logic [18:0] a1_mem;
    logic [18:0] a2_mem;
    logic [18:0] a3_mem;

    logic [18:0] b0_mem;
    logic [18:0] b1_mem;
    logic [18:0] b2_mem;
    logic [18:0] b3_mem;

    // ========================================================
    // COUNTER
    // ========================================================

    stream_counter u_counter (

        .clk(clk),
        .rst(rst),

        .rd_en(rd_en),

        .cycle(cycle)

    );

    // ========================================================
    // MEMORY
    // ========================================================

    matrix_memory u_memory (

        .clk(clk),
        .rst(rst),

        .rd_en(rd_en),

        .cycle(cycle),

        .a0_out(a0_mem),
        .a1_out(a1_mem),
        .a2_out(a2_mem),
        .a3_out(a3_mem),

        .b0_out(b0_mem),
        .b1_out(b1_mem),
        .b2_out(b2_mem),
        .b3_out(b3_mem)

    );

    // ========================================================
    // SKEW UNIT
    // ========================================================

    skew_unit u_skew (

        .clk(clk),
        .rst(rst),

        .rd_en(rd_en),

        .a0_in(a0_mem),
        .a1_in(a1_mem),
        .a2_in(a2_mem),
        .a3_in(a3_mem),

        .b0_in(b0_mem),
        .b1_in(b1_mem),
        .b2_in(b2_mem),
        .b3_in(b3_mem),

        .a0_out(a0_out),
        .a1_out(a1_out),
        .a2_out(a2_out),
        .a3_out(a3_out),

        .b0_out(b0_out),
        .b1_out(b1_out),
        .b2_out(b2_out),
        .b3_out(b3_out)

    );

endmodule



// ============================================================
// STREAM COUNTER
// ============================================================

module stream_counter (

    input  logic       clk,
    input  logic       rst,

    input  logic       rd_en,

    output logic [2:0] cycle

);

    always_ff @(posedge clk or posedge rst) begin

        if (rst)

            cycle <= 0;

        else if (rd_en) begin

            if (cycle < 7)

                cycle <= cycle + 1'b1;

        end

    end

endmodule



// ============================================================
// MATRIX MEMORY
// ============================================================

module matrix_memory (

    input  logic        clk,
    input  logic        rst,

    input  logic        rd_en,

    input  logic [2:0]  cycle,

    output logic [18:0] a0_out,
    output logic [18:0] a1_out,
    output logic [18:0] a2_out,
    output logic [18:0] a3_out,

    output logic [18:0] b0_out,
    output logic [18:0] b1_out,
    output logic [18:0] b2_out,
    output logic [18:0] b3_out

);

    // ========================================================
    // MEMORY
    // ========================================================

    logic [18:0] A_mem [0:15];

    logic [18:0] B_mem [0:15];

    // ========================================================
    // LOAD HEX FILE
    // ========================================================

    initial begin

        $readmemh("A.hex", A_mem);

        $readmemh("B.hex", B_mem);

    end

    // ========================================================
    // STREAM OUTPUT
    // ========================================================

    always_ff @(posedge clk or posedge rst) begin

        if (rst) begin

            a0_out <= 0;
            a1_out <= 0;
            a2_out <= 0;
            a3_out <= 0;

            b0_out <= 0;
            b1_out <= 0;
            b2_out <= 0;
            b3_out <= 0;

        end

        else if (rd_en) begin

            if (cycle <= 3) begin

                // =================================================
                // MATRIX A
                // =================================================

                a0_out <= A_mem[cycle];

                a1_out <= A_mem[4  + cycle];

                a2_out <= A_mem[8  + cycle];

                a3_out <= A_mem[12 + cycle];

                // =================================================
                // MATRIX B
                // =================================================

                b0_out <= B_mem[cycle*4];

                b1_out <= B_mem[cycle*4 + 1];

                b2_out <= B_mem[cycle*4 + 2];

                b3_out <= B_mem[cycle*4 + 3];

            end

            else begin

                a0_out <= 0;
                a1_out <= 0;
                a2_out <= 0;
                a3_out <= 0;

                b0_out <= 0;
                b1_out <= 0;
                b2_out <= 0;
                b3_out <= 0;

            end

        end

        else begin

            a0_out <= 0;
            a1_out <= 0;
            a2_out <= 0;
            a3_out <= 0;

            b0_out <= 0;
            b1_out <= 0;
            b2_out <= 0;
            b3_out <= 0;

        end

    end

endmodule



// ============================================================
// SKEW UNIT
// ============================================================

module skew_unit (

    input  logic        clk,
    input  logic        rst,

    input  logic        rd_en,

    input  logic [18:0] a0_in,
    input  logic [18:0] a1_in,
    input  logic [18:0] a2_in,
    input  logic [18:0] a3_in,

    input  logic [18:0] b0_in,
    input  logic [18:0] b1_in,
    input  logic [18:0] b2_in,
    input  logic [18:0] b3_in,

    output logic [18:0] a0_out,
    output logic [18:0] a1_out,
    output logic [18:0] a2_out,
    output logic [18:0] a3_out,

    output logic [18:0] b0_out,
    output logic [18:0] b1_out,
    output logic [18:0] b2_out,
    output logic [18:0] b3_out

);

    // ========================================================
    // DELAY REGISTERS
    // ========================================================

    logic [18:0] a1_d1;

    logic [18:0] a2_d1;
    logic [18:0] a2_d2;

    logic [18:0] a3_d1;
    logic [18:0] a3_d2;
    logic [18:0] a3_d3;

    logic [18:0] b1_d1;

    logic [18:0] b2_d1;
    logic [18:0] b2_d2;

    logic [18:0] b3_d1;
    logic [18:0] b3_d2;
    logic [18:0] b3_d3;

    // ========================================================
    // PIPELINE
    // ========================================================

    always_ff @(posedge clk or posedge rst) begin

        if (rst) begin

            a1_d1 <= 0;

            a2_d1 <= 0;
            a2_d2 <= 0;

            a3_d1 <= 0;
            a3_d2 <= 0;
            a3_d3 <= 0;

            b1_d1 <= 0;

            b2_d1 <= 0;
            b2_d2 <= 0;

            b3_d1 <= 0;
            b3_d2 <= 0;
            b3_d3 <= 0;

        end

        else if (rd_en) begin

            // =================================================
            // ROWS
            // =================================================

            a1_d1 <= a1_in;

            a2_d1 <= a2_in;
            a2_d2 <= a2_d1;

            a3_d1 <= a3_in;
            a3_d2 <= a3_d1;
            a3_d3 <= a3_d2;

            // =================================================
            // COLUMNS
            // =================================================

            b1_d1 <= b1_in;

            b2_d1 <= b2_in;
            b2_d2 <= b2_d1;

            b3_d1 <= b3_in;
            b3_d2 <= b3_d1;
            b3_d3 <= b3_d2;

        end

    end

    // ========================================================
    // OUTPUTS
    // ========================================================

    assign a0_out = a0_in;

    assign a1_out = a1_d1;

    assign a2_out = a2_d2;

    assign a3_out = a3_d3;

    assign b0_out = b0_in;

    assign b1_out = b1_d1;

    assign b2_out = b2_d2;

    assign b3_out = b3_d3;

endmodule