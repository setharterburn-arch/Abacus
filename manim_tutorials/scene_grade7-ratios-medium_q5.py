from manim import * 

class Grade7RatiosMedium4(Scene):
    def construct(self):
        cost_of_5_apples = MathTex(r'5 \text{ apples} = $2.50').to_edge(UP)
        self.play(Write(cost_of_5_apples))

        cost_of_1_apple = MathTex(r'1 \text{ apple} = \frac{$2.50}{5}').next_to(cost_of_5_apples, DOWN, buff=0.5)
        self.play(Write(cost_of_1_apple))

        calculate_cost_1 = MathTex(r'= $0.50').next_to(cost_of_1_apple, RIGHT, buff=0.5)
        self.play(Write(calculate_cost_1))

        cost_of_8_apples = MathTex(r'8 \text{ apples} = 8 \times $0.50').next_to(cost_of_1_apple, DOWN, buff=0.5)
        self.play(Write(cost_of_8_apples))

        calculate_cost_8 = MathTex(r'= $4.00').next_to(cost_of_8_apples, RIGHT, buff=0.5)
        self.play(Write(calculate_cost_8))

        self.wait(3)