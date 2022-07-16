import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:window_manager/window_manager.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  // Must add this line.
  await windowManager.ensureInitialized();
  const WindowOptions windowOptions = WindowOptions(
    size: Size(400, 300),
    center: true,
    backgroundColor: Colors.transparent,
    skipTaskbar: false,
    titleBarStyle: TitleBarStyle.hidden,
  );
  windowManager.waitUntilReadyToShow(windowOptions, () async {
    await windowManager.show();
    await windowManager.focus();
  });

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '今天吃什么选择器 - zznQ',
      themeMode: ThemeMode.light,
      home: Scaffold(
        appBar: AppBar(
            title: const Text(
              '今天吃什么选择器',
              style: TextStyle(
                color: Colors.black,
                fontSize: 12,
              ),
            ),
            backgroundColor: Colors.white,
            toolbarHeight: 35),
        body: const Center(
          child: FoodsSelector(),
        ),
      ),
    );
  }
}

class FoodsSelector extends StatefulWidget {
  const FoodsSelector({Key? key}) : super(key: key);

  @override
  State<FoodsSelector> createState() => _FoodsSelectorState();
}

class _FoodsSelectorState extends State<FoodsSelector> {
  bool _running = true;
  final _foods = <Image>[
    const Image(image: AssetImage('resource/logo.png'), width: 200, height: 200)
  ];
  int _index = 0;

  @override
  void initState() {
    _initFoods();

    super.initState();
    int count = 0;
    const period = Duration(milliseconds: 60);
    Timer.periodic(period, (timer) {
      if (_running) {
        setState(() {
          _index = count % _foods.length;
        });
      }
      count++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: <Widget>[
        const SizedBox(height: 5),
        _foods[_index],
        TextButton(
          child: Text(_running ? '停止' : '开始'),
          onPressed: () {
            setState(() {
              _running = !_running;
            });
          },
        ),
      ],
    );
  }

  Future _initFoods() async {
    final Map<String, dynamic> assets =
        jsonDecode(await rootBundle.loadString('AssetManifest.json'));
    assets.keys
        .where((String key) =>
            key.contains('resource/foods/') && key.contains('.png'))
        .toList()
        .forEach((element) {
      _foods.add(Image(image: AssetImage(element), width: 200, height: 200));
    });
    _foods.removeAt(0);
  }
}
