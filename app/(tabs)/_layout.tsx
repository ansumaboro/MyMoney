import { Tabs } from "expo-router";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TabIcon = ({ focused, title, icon }: any) => {
    return (
        <View
            style={
                {
                    borderRadius: 50,
                    // marginTop: 21,
                    overflow: 'hidden',
                    height: 60,
                    width: 180,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginVertical: 'auto',
                }
            }
        >
            <Ionicons name={focused ? icon : icon + "-outline"} style={{
                fontSize: 28,
                color: focused ? '#f0f0f0' : '#c0c0c0',
            }} />
            {focused && <Text
                style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: '#fff'
                }}
            >
                {title}
            </Text>}
        </View>
    )
}

export default function Tablayout() {
    const insets = useSafeAreaInsets();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    backgroundColor: '#2f2d9b',
                    height: 70,
                    width: '90%',
                    marginHorizontal: 'auto',
                    marginBottom: insets.bottom,
                    borderRadius: 50,
                    flexDirection: "row",
                    marginTop: 0,
                },
                tabBarHideOnKeyboard: true,
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} title="Home" icon={"home"} />
                    )
                }}
            />
            <Tabs.Screen
                name="transactions"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} title="Transactions" icon={"clipboard"} />
                    )
                }}
            />
        </Tabs>
    );
}