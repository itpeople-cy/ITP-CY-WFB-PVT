/******************************************************************
Copyright IT People Corporation. 2018 All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

                 http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

******************************************************************/
package itpcutils

import (
	"fmt"

	"time"
)

const dateTimeFormat = "2006-01-02"

////////////////////////////////////////////
// Provides the offset from the week beginning
// provided the functions knows date
// and the week beginning day symbol
// dayIndex("Su", "Th")
////////////////////////////////////////////
func dayIndex(d1 string, d2 string) int {
	xtr := map[string][]string{
		"Mo": {"Su", "Sa", "Fr", "We", "Th", "Tu"},
		"Tu": {"Mo", "Su", "Sa", "Fr", "Th", "We"},
		"We": {"Tu", "Mo", "Su", "Sa", "Fr", "Th"},
		"Th": {"We", "Tu", "Mo", "Su", "Sa", "Fr"},
		"Fr": {"Th", "We", "Tu", "Mo", "Su", "Sa"},
		"Sa": {"Fr", "Th", "We", "Tu", "Mo", "Su"},
		"Su": {"Sa", "Fr", "Th", "We", "Tu", "Mo"},
	}

	row := xtr[d1]

	for i, each := range row {
		if each == d2 {
			return i
		}
	}

	return -1
}

// TSWeekBegin ("Su", 2006-01-02")
// Get the Beginning date of the week
func TSWeekBegin(weekstartday string, currentDate string) string {
	t, _ := time.Parse(dateTimeFormat, currentDate)
	x := fmt.Sprintf("%s", t.Weekday())
	z := dayIndex(x[:2], weekstartday) + 1
	newDate := t.AddDate(0, 0, -1*z)
	return newDate.Format(dateTimeFormat)
}

func TSWeekEnd(currentDate string) string {
	t, _ := time.Parse(dateTimeFormat, TSWeekBegin(WEEK_BEGIN, currentDate))
	t = t.AddDate(0, 0, 6)
	return t.Format(dateTimeFormat)
}

func TSNextWeek(currentDate string) string {
	t, _ := time.Parse(dateTimeFormat, currentDate)
	t = t.AddDate(0, 0, 7)
	return t.Format(dateTimeFormat)
}

func TSPreviousWeek(currentDate string) string {
	t, _ := time.Parse(dateTimeFormat, currentDate)
	t = t.AddDate(0, 0, -7)
	return t.Format(dateTimeFormat)
}
func TSPreviousInvoiceCycleDate(currentDate string) string {
	t, _ := time.Parse(dateTimeFormat, currentDate)
	t = t.AddDate(0, 0, -28)
	return t.Format(dateTimeFormat)
}
func CurrentDay() string {
	current_time := time.Now().Local()
	return current_time.Format(dateTimeFormat)
}
func FinancialYear(date string) int {
	t, _ := time.Parse(dateTimeFormat, date)
	return t.Year()
}
func NextCalendarDay(currentDate string) string {
	t, _ := time.Parse(dateTimeFormat, currentDate)
	t = t.AddDate(0, 0, 1)
	return t.Format(dateTimeFormat)
}

func CalendarDay(currentDate string) string {
	t, _ := time.Parse(dateTimeFormat, currentDate)
	return t.Format(dateTimeFormat)
}

func CompareDate(day1, day2 string) bool {
	t1, _ := time.Parse(dateTimeFormat, day1)
	t2, _ := time.Parse(dateTimeFormat, day2)
	return t1.Before(t2) || t1.Equal(t2)
}

func AfterDate(day1, day2 string) bool {
	t1, _ := time.Parse(dateTimeFormat, day1)
	t2, _ := time.Parse(dateTimeFormat, day2)
	return t1.After(t2)
}

func BeforeDate(day1, day2 string) bool {
	t1, _ := time.Parse(dateTimeFormat, day1)
	t2, _ := time.Parse(dateTimeFormat, day2)
	return t1.Before(t2)
}

func IsSameDate(day1, day2 string) bool {
	t1, _ := time.Parse(dateTimeFormat, day1)
	t2, _ := time.Parse(dateTimeFormat, day2)
	return t1.Equal(t2)
}

func InTimeRange(day1, day2, day3, day4 string) bool {
	t1, _ := time.Parse(dateTimeFormat, day1) //start
	t2, _ := time.Parse(dateTimeFormat, day2) //end
	t3, _ := time.Parse(dateTimeFormat, day3) //target.start
	t4, _ := time.Parse(dateTimeFormat, day4) //target.end

	return (((t1.Before(t3) || t1.Equal(t3)) && (t2.After(t3) || t2.Equal(t3))) ||
		((t1.Before(t4) || t1.Equal(t4)) && (t2.After(t4) || t2.Equal(t4))) ||
		((t1.After(t3) || t1.Equal(t3)) && (t2.Before(t4) || t2.Equal(t4))))
}

func IsDateInTimeRange(day1, day2, day3 string) bool {
	t1, _ := time.Parse(dateTimeFormat, day1) //target
	t2, _ := time.Parse(dateTimeFormat, day2) //start
	t3, _ := time.Parse(dateTimeFormat, day3) //end

	return (t1.After(t2) || t1.Equal(t2)) && (t1.Before(t3) || t1.Equal(t3))
}

func FormatApprovalDate(currentDate string) string {
	t, _ := time.Parse(dateTimeFormat, currentDate)
	return t.Format("2006-01-02 15:04:05 -07:00")
}

func FormatApprovalEndDate(currentDate string) string {
	t, _ := time.Parse(dateTimeFormat, currentDate)
	t = t.AddDate(0, 0, 1)
	return t.Format("2006-01-02 15:04:05 -07:00")
}
