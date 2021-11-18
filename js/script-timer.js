//'use strict';
 
////////////////////////////
window.onload = function() {
 

    new Timer({
        parent: 'timer-wrap1',
        
        // classes: ['timer-hour', 'timer-min', 'timer-sec'],
        format: true,
        curentUserHour: 0,
        curentUserMin: 0,
        curentUserSec: 0,
        year: 0,
        month: 0,
        day: 8,
        hour: 09,
        min: 0,
        sec: 0
    });
 
}


function Timer(options) {
    var self = this;

    this.parentWrap = document.querySelector('.' + options.parent);
    this.prefix = options.prefix;
    this.timerArrayClasses = options.classes || [  'timer-day', 'timer-hour', 'timer-min', 'timer-sec'];
    //this.sayEndAction = options.stop || 'Время вышло';
    var curentDate = new Date();
    var attrArray = ['sec', 'min', 'hour', 'day', 'month'];

    var timerLabelMonth = ['месяц', 'месяца', 'месяцев'],
        timerLabelDay = ['день', 'дня', 'дней'],
        timerLabelHour = ['час', 'часа', 'часов'],
        timerLabelMin = ['минута', 'минуты', 'минут'],
        timerLabelSec = ['секунда', 'секунды', 'секунд'];


    if (options.format) {
        this.userYear = curentDate.getFullYear() + options.year || curentDate.getFullYear();
        this.userMonth = curentDate.getMonth() + options.month || curentDate.getMonth();
        this.userDay = curentDate.getDate() + options.day || curentDate.getDate();
        this.userHour = options.curentUserHour + options.hour || 0 + options.hour;
        this.userMin = options.curentUserMin + options.min || 0 + options.min || 0;
        this.userSec = options.curentUserSec + options.sec || 0 + options.sec || 0;
    } else {
        this.userYear = options.year || curentDate.getFullYear();
        if (options.month) {
            this.userMonth = getMonthNum(options.month)
        } else {
            this.userMonth = curentDate.getMonth();
        }
        this.userDay = options.day || curentDate.getDate();
        this.userHour = options.hour || 0;
        this.userMin = options.min || 0;
        this.userSec = options.sec || 0;
    }

    this.userDate = new Date(this.userYear, this.userMonth, this.userDay, this.userHour, this.userMin, this.userSec);

 
    function getMonthNum(el) {
        var monthArr = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

        if (isNaN(el)) {
            el = el.toLowerCase();

            for (var i = 0; i < monthArr.length; i++) {
                if (el === monthArr[i].toLowerCase()) {
                    el = i;
                }
            }
        } else {
            el = el - 1;
        }

        return el;
    }
 
    function newAttrArray() {
        if (attrArray.length !== self.timerArrayClasses.length) {
            attrArray.length = self.timerArrayClasses.length;
        }

        attrArray = attrArray.reverse();
    }

    newAttrArray();
 
    self.createTimerElement = function(teg, className, attr) {
        var el = document.createElement(teg);
        if (this.prefix) {
            el.classList.add(this.prefix + '-' + className);
        } else {
            el.classList.add(className);
        }

        if (attr) {
            el.setAttribute('data-name', attr);
        }

        return el;
    }
 
    self.printTimerHtml = function(array) {
        for (var i = 0; i < array.length; i++) {
            var el = self.createTimerElement('div', array[i], attrArray[i]);
            el.classList.add('timer-box');
            var timerVal = self.createTimerElement('div', 'timer-num');
            var label = self.createTimerElement('div', 'timer-label');

            for (var j = 0; j < 2; j++) {
                var span;
                if (j == 0) {
                    span = self.createTimerElement('span', 'timer-ten');
                } else {
                    span = self.createTimerElement('span', 'timer-units');
                }

                timerVal.appendChild(span);
            }

            el.appendChild(timerVal);
            el.appendChild(label);

            this.parentWrap.appendChild(el);
        }
    }

    self.printTimerHtml(this.timerArrayClasses);

 
    function timerDestroy() {
        self.parentWrap.innerHTML = '<span class="finish-text">' + self.sayEndAction + '</span>';
        clearInterval(initTimer);
    }

 
    var getElement = function(el, value, order) {
        if (order) {
            el = el.firstElementChild.firstElementChild;
            el.innerText = parseInt(value / 10);
        } else {
            el = el.firstElementChild.lastElementChild;
            el.innerHTML = value % 10;
        }
        return el;
    }



    var getTimerLabel = function(el, time, label) {
        time %= 100;
        var time1 = time % 10;

        if (time > 10 && time < 20) {
            return el.innerText = label[2];
        }
        if (time1 > 1 && time1 < 5) {
            return el.innerText = label[1];
        }
        if (time1 == 1) {
            return el.innerText = label[0];
        }
        return el.innerText = label[2];
    }


    var getQuantityMonth = function(newtime, days) {
        var statusYear;
        if(days < 365) {
            statusYear = new Date(newtime.getFullYear(), 2, 0).getDate();
            
            if(newtime.getMonth() == 1 || (newtime.getMonth() + 1) == 1) {
                if(statusYear == 28) {
                    days++;
                }
            }
        } else {
            var dateYear = this.userYear - newtime.getFullYear();
            for(var i = 0; i <= dateYear; i++) {
                statusYear = new Date(newtime.getFullYear() + i, 2, 0).getDate();

                if(newtime.getMonth() == 1 || (newtime.getMonth() + 1) == 1) {
                    if(statusYear == 28) {
                        days++;
                    }
                }                    
            }                
        }
        return days;
    }


    var getQuantityDays = function(countMonth, curD, summDays) {
        var daysInMonth;
        var monthCount = 0;
        var yearCount = 0;
        var count = 0;

        for(var i = 0; i < countMonth; i++) {

            if(monthCount > 11) {
                monthCount = 0;
                yearCount++;
            }

            if((curD.getMonth() + monthCount) != 1) {
                daysInMonth = 32 - new Date(curD.getFullYear() + yearCount, curD.getMonth() + monthCount, 32).getDate();

                if(daysInMonth == 31) {
                    count++;
                }
            } else {
                daysInMonth = 32 - new Date(curD.getFullYear() + yearCount, curD.getMonth() + monthCount, 32).getDate();
 
                count--;
            }
            monthCount++;
        }       
        summDays = parseInt(summDays % 30) ;
        return (summDays - count);
    }


    // подсчет значений и вывод на экран
    self.initCountDoun = function(newtime) {
        newtime = new Date();

        var timerEnd = this.userDate.getTime() - newtime.getTime();

        if (parseInt(timerEnd / 1000) > 0) {
            var days = Math.floor(timerEnd / 864e5);
            leftMonth = Math.floor(getQuantityMonth(newtime, days) / 30);
            var leftDays = getQuantityDays(leftMonth, newtime, days);
            var leftHours = parseInt(timerEnd / (60 * 60 * 1000)) % 24;
            var leftMin = parseInt(timerEnd / (60 * 1000)) % 60;
            var leftSec = parseInt(timerEnd / 1000) % 60;


            var temp = this.parentWrap.children;

            for (var i = 0; i < temp.length; i++) {

                var attr = temp[i].getAttribute('data-name');

                switch (attr) {
                    case 'month':
                        getElement(temp[i], leftMonth, true);
                        getElement(temp[i], leftMonth);
                        getTimerLabel(temp[i].lastElementChild, leftMonth, timerLabelMonth);
                        break;

                    case 'day':
                        getElement(temp[i], leftDays, true);
                        getElement(temp[i], leftDays);
                        getTimerLabel(temp[i].lastElementChild, leftDays, timerLabelDay);
                        break;

                    case 'hour':
                        getElement(temp[i], leftHours, true);
                        getElement(temp[i], leftHours);
                        getTimerLabel(temp[i].lastElementChild, leftHours, timerLabelHour);
                        break;

                    case 'min':
                        getElement(temp[i], leftMin, true);
                        getElement(temp[i], leftMin);
                        getTimerLabel(temp[i].lastElementChild, leftMin, timerLabelMin);
                        break;

                    case 'sec':
                        getElement(temp[i], leftSec, true);
                        getElement(temp[i], leftSec);
                        getTimerLabel(temp[i].lastElementChild, leftSec, timerLabelSec);
                        break;
                }
            }

        } else {
            timerDestroy();
        }

    }

    self.initCountDoun(curentDate);

 
    function init() {
        self.initCountDoun(curentDate);
    }

    var initTimer = setInterval(init, 1000);
 
}