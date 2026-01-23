from manim import *

class Grade7PrealgebraMedium5(Scene):
    def construct(self):
        expression = MathTex("a - b, \text{ where } a = 5, b = -2").scale(1.2)
        self.play(Write(expression))
        self.wait(1)

        step1 = MathTex("5 - (-2)").next_to(expression, DOWN, buff=0.5).scale(1.2)
        arrow1 = Arrow(expression.get_bottom(), step1.get_top(), buff=0.1)
        self.play(TransformFromCopy(expression, step1), Create(arrow1))
        self.wait(1)

        step2 = MathTex("5 + 2").next_to(step1, DOWN, buff=0.5).scale(1.2)
        arrow2 = Arrow(step1.get_bottom(), step2.get_top(), buff=0.1)
        self.play(TransformFromCopy(step1, step2), Create(arrow2))
        self.wait(1)

        step3 = MathTex("7").next_to(step2, DOWN, buff=0.5).scale(1.2)
        arrow3 = Arrow(step2.get_bottom(), step3.get_top(), buff=0.1)
        self.play(TransformFromCopy(step2, step3), Create(arrow3))
        self.wait(1)

        self.play(FadeOut(expression, step1, step2, step3, arrow1, arrow2, arrow3))
        answer = MathTex("\text{Answer: } 7").scale(1.5)
        self.play(Write(answer))
        self.wait(2)