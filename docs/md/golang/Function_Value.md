# Function Value

Go中函数可作为参数、返回或变量，其称为Function Value。

Function Value类似C的函数指针，但又有所不同，Function Value其实是一个二级指针。

![image-20221019110232989](https://imgs-1306864474.cos.ap-beijing.myqcloud.com/img/image-20221019110232989.png)

**举例：闭包**

```go
func mc(n int) func() int {
	return func() int {
		return n
	}
}
```

编译器会识别出闭包这种代码模式，并且自动定义了这个 struct 类型进行支持。

```go
type funcval struct {
	F uintptr
	n int
}
```

闭包对象的成员可以进一步划分，第1个字段F用来存储目标函数的地址，这在所有闭包对象中是一致的。从第2个字段开始，后续的字段称为闭包的捕获列表，也就是内层函数中用到的所有定义在外层函数中的变量，编译器认为这些变量被闭包捕获了，会把他们追加到闭包对象的struct定义中。

把一个普通函数赋值给一个Function Value的时候都要在堆上分配一个指针浪费性能。因为每个闭包对象要保存自己的捕获变量，所以要到执行阶段才创建对应的闭包对象。普通函数不构成闭包也没有捕获列表，没必要动态分配，所以编译器会对不构成闭包的Function Value的第二层指针是编译阶段静态分配的。

![image-20221019112149018](https://imgs-1306864474.cos.ap-beijing.myqcloud.com/img/image-20221019112149018.png)

闭包的代码段存储在addr1，每次调用闭包时会在堆上另外生成对应的funcval结构体。f1存储addr2，f2存储addr3，并通过fn存储的addr1来进行闭包函数的调用。

通过一个Function Value调用函数时，会把funcval结构体的地址存入特定寄存器（amd64，DX寄存器），得到地址后，可加上相应的偏移来得到每一个被捕获的变量。没有捕获列表的Function Value直接忽略这个寄存器的值。

```go
// 创建一个闭包，make closure
func mc(start int) func() int {
	return func() int {
		start++
		return start
	}
}

type funcval struct {
    F uintptr
    start * int
}
```

对于闭包捕获的变量，如果没有对其进行修改就分配值，如果对其变量进行修改就分配指针。mc()中satrt++，因为修改了值，所以在创建funcval时，会被分配为指针。

```go
func sc(n int) int {
	f := func() int {
		return n
	}
	return f()
}
```

闭包对象没有逃逸，其会被分配到栈中。

![image-20221019114752185](https://imgs-1306864474.cos.ap-beijing.myqcloud.com/img/image-20221019114752185.png)

