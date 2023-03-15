type Unit = 'day' | 'hour' | 'minute' | 'second';

const prefixZero = (num: number) => num.toString().padStart(2, '0');

class Timer {
  private totalSeconds: number;

  constructor(
    private day = 0,
    private hour = 0,
    private minute = 0,
    private second = 0
  ) {
    this.totalSeconds =
      this.second + this.minute * 60 + this.hour * 3600 + this.day * 86400;
    this.update();
  }

  add(value: number, unit: Unit) {
    this[unit] += value;

    this.update();
    return this;
  }

  subtract(value: number, unit: Unit) {
    this[unit] -= value;

    this.update();
    return this;
  }

  format() {
    this.update();
    const formatArr = [this.minute, this.second];
    if (this.hour !== 0 || this.day !== 0) formatArr.unshift(this.hour);
    if (this.day !== 0) formatArr.unshift(this.day);

    return formatArr.map(n => prefixZero(n)).join(':');
  }

  reset() {
    this.day = 0;
    this.hour = 0;
    this.minute = 0;
    this.second = 0;
    this.totalSeconds = 0;
  }

  diff(timer: Timer) {
    // this - timer
    return new Timer(
      this.day - timer.day,
      this.hour - timer.hour,
      this.minute - timer.minute,
      this.second - timer.second
    );
  }

  update() {
    this.totalSeconds =
      this.second + this.minute * 60 + this.hour * 3600 + this.day * 86400;

    if (this.totalSeconds >= 0) {
      // 进位
      while (this.second >= 60) {
        this.second -= 60;
        this.minute += 1;
      }
      while (this.minute >= 60) {
        this.minute -= 60;
        this.hour += 1;
      }
      while (this.hour >= 24) {
        this.hour -= 24;
        this.day += 1;
      }

      // 借位
      while (this.second < 0) {
        this.second += 60;
        this.minute -= 1;
      }
      while (this.minute < 0) {
        this.minute += 60;
        this.hour -= 1;
      }
      while (this.hour < 0) {
        this.hour += 24;
        this.day -= 1;
      }
    } else {
      // 进位
      while (this.second <= -60) {
        this.second += 60;
        this.minute -= 1;
      }
      while (this.minute <= -60) {
        this.minute += 60;
        this.hour -= 1;
      }
      while (this.hour <= -24) {
        this.hour += 24;
        this.day -= 1;
      }

      // 借位
      while (this.second > 0) {
        this.second -= 60;
        this.minute += 1;
      }
      while (this.minute > 0) {
        this.minute -= 60;
        this.hour += 1;
      }
      while (this.hour > 0) {
        this.hour -= 24;
        this.day += 1;
      }
    }
    return this;
  }
}

export default Timer;
