import { describe, expect, it } from "vitest";
import { formatDate, formatDateTime, formatTime } from "@/lib/format/date";

describe("định dạng ngày theo Asia/Ho_Chi_Minh", () => {
  it("chuyển UTC sang giờ Việt Nam và qua ngày mới", () => {
    // 17:30 UTC ngày 14/09 = 00:30 ngày 15/09 giờ Việt Nam (UTC+7)
    expect(formatDate("2026-09-14T17:30:00Z")).toBe("15/09/2026");
    expect(formatTime("2026-09-14T17:30:00Z")).toBe("00:30");
    expect(formatDateTime("2026-09-14T17:30:00Z")).toBe("00:30, 15/09/2026");
  });

  it("dùng 24 giờ, không ra 24:xx", () => {
    expect(formatTime("2026-09-14T17:00:00Z")).toBe("00:00");
  });

  it("từ chối giá trị không hợp lệ thay vì trả chuỗi sai", () => {
    expect(() => formatDate("không phải ngày")).toThrow(RangeError);
  });
});
